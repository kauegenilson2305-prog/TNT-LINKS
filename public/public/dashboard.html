const $=s=>document.querySelector(s), message=$("#message");
function show(text,ok=false){message.textContent=text;message.style.color=ok?"#9ee6b2":"#ffb0c0"}
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===btn));$("#login").classList.toggle("hidden",btn.dataset.view!=="login");$("#register").classList.toggle("hidden",btn.dataset.view!=="register");show("")}));
async function send(path,data){const r=await fetch(path,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});const d=await r.json();if(!r.ok)throw Error(d.error||"Ocorreu um erro.");return d}
$("#login").addEventListener("submit",async e=>{e.preventDefault();const f=new FormData(e.target);try{await send("/api/login",Object.fromEntries(f));location.href="/dashboard.html"}catch(err){show(err.message)}});
$("#register").addEventListener("submit",async e=>{e.preventDefault();const f=new FormData(e.target);try{const d=await send("/api/register",Object.fromEntries(f));show(d.message,true);document.querySelector('[data-view="login"]').click()}catch(err){show(err.message)}});
$("#forgot").addEventListener("click",async()=>{const email=$("#login [name=email]").value;if(!email){show("Digite seu e-mail primeiro.");return}try{const d=await send("/api/forgot-password",{email});show(d.message,true)}catch(err){show(err.message)}});
fetch("/api/me").then(r=>{if(r.ok)location.href="/dashboard.html"}).catch(()=>{});
