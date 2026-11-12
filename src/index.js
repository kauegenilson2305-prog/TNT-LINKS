const SESSION_DAYS = 7;
const encoder = new TextEncoder();

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers }
  });
}

function randomHex(bytes = 24) {
  const data = crypto.getRandomValues(new Uint8Array(bytes));
  return [...data].map(x => x.toString(16).padStart(2, "0")).join("");
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, "0")).join("");
}

async function passwordHash(password, saltHex) {
  const salt = Uint8Array.from(saltHex.match(/.{2}/g), x => parseInt(x, 16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 210000, hash: "SHA-256" }, key, 256
  );
  return [...new Uint8Array(bits)].map(x => x.toString(16).padStart(2, "0")).join("");
}

function cookie(name, value, maxAge) {
  return `${name}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

function getCookie(request, name) {
  const raw = request.headers.get("Cookie") || "";
  const part = raw.split(";").map(x => x.trim()).find(x => x.startsWith(name + "="));
  return part ? part.slice(name.length + 1) : null;
}

async function currentUser(request, env) {
  const token = getCookie(request, "tnt_session");
  if (!token) return null;
  const tokenHash = await sha256(token);
  const row = await env.DB.prepare(
    `SELECT users.id, users.name, users.email
     FROM sessions JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = ? AND sessions.expires_at > ?`
  ).bind(tokenHash, Math.floor(Date.now() / 1000)).first();
  return row || null;
}

function validEmail(email) {
  return typeof email === "string" && email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validDestination(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".");
  } catch { return false; }
}

async function api(request, env, path) {
  if (request.method === "POST" && path === "/api/register") {
    const body = await request.json().catch(() => ({}));
    const name = String(body.name || "").trim().slice(0, 80);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (name.length < 2 || !validEmail(email) || password.length < 10 || password.length > 128)
      return json({ error: "Informe nome, e-mail válido e senha com pelo menos 10 caracteres." }, 400);
    const salt = randomHex(16);
    const hash = await passwordHash(password, salt);
    const id = crypto.randomUUID();
    try {
      await env.DB.prepare("INSERT INTO users (id, name, email, password_hash, password_salt) VALUES (?, ?, ?, ?, ?)")
        .bind(id, name, email, hash, salt).run();
    } catch {
      return json({ error: "Não foi possível criar a conta. Esse e-mail pode já estar cadastrado." }, 409);
    }
    return json({ ok: true, message: "Conta criada. Agora entre com seu e-mail e senha." }, 201);
  }

  if (request.method === "POST" && path === "/api/login") {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    if (!user) return json({ error: "E-mail ou senha incorretos." }, 401);
    const candidate = await passwordHash(password, user.password_salt);
    if (candidate !== user.password_hash) return json({ error: "E-mail ou senha incorretos." }, 401);
    const token = randomHex(32);
    const expiry = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
    await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
      .bind(await sha256(token), user.id, expiry).run();
    return json({ ok: true, user: { name: user.
