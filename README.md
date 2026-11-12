# TNT LINKS

Starter MVP de um encurtador de links com identidade visual roxa e preta.

## Stack
- Cloudflare Workers
- Cloudflare D1
- HTML/CSS/JavaScript
- Web Crypto API (hash de senha PBKDF2 e tokens aleatórios)

## Recursos incluídos
- Cadastro, login e logout
- Sessões armazenadas no D1
- Painel individual
- Criação de links curtos
- Contagem de cliques
- Página intermediária de anúncio configurável
- Estrutura inicial para recuperação de senha

## Importante
Este é um projeto inicial. Antes de abrir ao público:
1. Configure o D1 e publique o Worker.
2. Configure `APP_BASE_URL` com o endereço público.
3. Configure um provedor de e-mail transacional para recuperação de senha.
4. Revise os limites, políticas de privacidade, termos de uso e moderação de links.
5. Configure proteção contra abuso, spam e phishing.
6. Faça testes com dados não sensíveis.

A recuperação de senha neste starter não envia e-mail por conta própria: ela informa que a integração de e-mail precisa ser configurada. Não use um código de recuperação exibido publicamente em produção.

## Configuração pelo computador ou celular
O painel da Cloudflare pode ser usado pelo navegador do Android em modo "Site para computador".

### 1. Criar banco D1
No painel Cloudflare, abra Workers & Pages > D1 SQL Database e crie um banco chamado `tnt-links-db`.
Copie o identificador do banco para `wrangler.toml`.

### 2. Criar tabelas
Execute o conteúdo de `schema.sql` no console SQL do D1.

### 3. Configurar
Edite `wrangler.toml`:
- substitua `COLOQUE_SEU_DATABASE_ID`
- mantenha o nome do binding como `DB`

### 4. Publicar
Instale Wrangler em um ambiente compatível e execute:
```bash
npm install
npx wrangler login
npx wrangler deploy
```

Para desenvolvimento local:
```bash
npm run dev
```

## Recuperação de senha
O endpoint `/api/forgot-password` cria um token de uso único e guarda somente seu hash. O envio do e-mail não está ativado nesta versão. Integre um provedor de e-mail antes de permitir recuperação real de contas.

## Anúncios
A página intermediária possui um espaço visual para anúncio. A integração com uma rede publicitária depende da aprovação da rede e de suas políticas. Não coloque anúncios que induzam cliques acidentais ou escondam o destino final.
