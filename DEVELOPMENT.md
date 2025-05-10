
## 🚀 Requisitos

- Node.js **v24.0.0**
- Um bot cadastrado no Discord Developer Portal
- Um servidor (Guild) para testes

---

## 🔐 Variáveis de ambiente (.env)

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
DISCORD_TOKEN= o token do seu bot
DISCORD_CLIENT_ID= id do bot no discord
DISCORD_GUILD_ID= id do servidor do discord
```

A chave `DISCORD_TOKEN` é obtida no [Discord Developer Portal](https://discord.com/developers/applications).
Os IDS basta entrar no discord e clicar com o botão direito no bot e no servidor, todos são a ultima opção.

---

## 🧪 Rodando o projeto localmente

Instale as dependências:

```bash
npm install
```

Agora leia atentamente o [DATABASE.md](https://github.com/codify-community/codify-bot/blob/main/DATABASE.md) para entender a configuracao local do banco de dados

E rode no seu PC :

```bash
npm run start:dev
```

Compile para produção:

```bash
npm run build
```

Rode a versão compilada:

```bash
npm start
```

---

## 📆 Comandos

Todos os comandos estão dentro de `src/commands/`. Cada arquivo deve exportar:

```ts
export default {
  data: new SlashCommandBuilder() // define nome, descrição e opções
  execute(interaction)            // lógica ao ser chamado, o que ele vai fazer
}
```

### Atenção dev:
O carregamento e registro é feito automaticamente ao subir o bot e TODOS os .ts seguem um padrão:

```properties
nomeDoComando.ts
```
e TODOS devem ficar dentro da pasta `src/commands/`

---

## ✨ Embeds

As mensagens embed são geradas com um helper reutilizável:

```ts
createEmbed({
  title: "Título",
  description: "Texto formatado",
  color: BotColors.success,
  image: attach.gifs.ping,
  timestamp: true
});
```

Você pode importar o `createEmbed` e `BotColors` de:

```ts
import { createEmbed, BotColors } from "./utils/embeds/embedMessages";
```

---

## 🎮 Attach.json

O arquivo `attach.json` contém links prontos para GIFs usados em comandos e mensagens:

```json
{
  "gifs": {
    "ping": "https://i.ibb.co/ ... .gif",
    "love": "https://i.ibb.co/ ... .gif"
  },
  "img": {
    "hello": "https://i.ibb.co/....",
  }
}
```

Use assim:

```ts
import attach from "../../attach.json";
attach.gifs.ping; // "https://i.ibb.co/ ... .gif"
```

Todos eles são mantidos por [imgbb](https://imgbb.com/)

Para adicionar novos, faça o seguinte:
- Crie sua conta no [site](https://imgbb.com/)
- Realize seu upload
- Se atente para deixar SEM tempo de expiração e público
- busque pelo LINK NATIVO e não qualquer outro, o formato dele basicamente segue os outros que já estão no `attach.json`("https://i.ibb.co/StringAleatoria/arquivo.***")
- daí basta adicionar no `attach.json` e usar no projeto

---