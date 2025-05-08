# 🤖 CodifyBot

Bot de Discord escrito em **TypeScript** usando a biblioteca [discord.js](https://discord.js.org/).
Feito para interagir com slash commands personalizados, com mensagens estilizadas via embeds e GIFs.

---

## 💪 Como contribuir

Fale com um dos ADM do [servidor do discord da Codify](https://discord.gg/VbKyRrnn8W)

Segue abaixo uma pequena doc e como de fato codar o bot!

---

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

A chave DISCORD_TOKEN é obtida no [Discord Developer Portal](https://discord.com/developers/applications).
Os IDS basta entrar no discord e clicar com o botão direito no bot e no servidor, todos são a ultima opção.

---

## 🧪 Rodando o projeto localmente

Instale as dependências:

```bash
npm install
```

E rode no seu PC :

```bash
npm run dev
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
  data: new SlashCommandBuilder() // define nome, descrição, opções
  execute(interaction)            // lógica ao ser chamado
}
```

### Atenção dev:
O carregamento e registro é feito automaticamente ao subir o bot e TODOS os .ts seguem um padrão:

```properties
nome_do_comando.ts
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
    "ping": "https://i.ibb.co/2g1CTst/ping.gif",
    "love": "https://i.ibb.co/NgYxJW1Q/love.gif"
  }
}
```

Use assim:

```ts
import attach from "../../attach.json";
attach.gifs.ping; // "https://i.ibb.co/2g1CTst/ping.gif"
```

---

## 🧐 Exemplo de comando com tudo

```ts
await interaction.reply({
  embeds: [
    createEmbed({
      title: "Olá!",
      description: `Olá <@${user.id}>!`,
      image: attach.gifs.love,
      color: BotColors.primary,
      timestamp: true
    })
  ]
});
```

---

Feito inicialmente com 💜 por Dev Curumin.
