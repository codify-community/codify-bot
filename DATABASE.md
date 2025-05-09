## 🛠️ Banco de Dados (Prisma)

Este projeto utiliza o [Prisma ORM](https://www.prisma.io/) com PostgreSQL para gerenciar o banco de dados.

---

### 🔧 Configuração

No seu arquivo `.env`, adicione:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
```

---

### 🧱 Comandos principais

| Ação                        | Comando                                               |
|----------------------------|--------------------------------------------------------|
| Gerar nova migration       | `npx prisma migrate dev --name nome_da_migration`     |
| Aplicar migrations (prod)  | `npx prisma migrate deploy`                           |
| Regenerar client Prisma    | `npx prisma generate`                                 |
| Acessar interface visual   | `npx prisma studio`                                   |

---

### 🛠️ Ambiente clonado

Após clonar o projeto, configurar o `.env` e rodar:

```bash
npm install
npx prisma migrate deploy
```

---

### 🚀 Seed (futuro)

O projeto poderá usar seeds com:

```bash
npx prisma db seed
```

---
> ⚠️ O diretório `generated/` onde o Prisma Client é salvo está no `.gitignore` e será gerado automaticamente via `prisma generate`.