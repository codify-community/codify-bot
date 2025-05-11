## 🛠️ Banco de Dados (Prisma)

Este projeto utiliza o [Prisma ORM](https://www.prisma.io/) com PostgreSQL para gerenciar o banco de dados.

---

### 🔧 Configuração

> ⚠️ ATENÇÃO DEV!
> Antes de mais nada, voce precisa ter o banco de dados [PostgreSQL](https://www.postgresql.org/) instalado e operando em sua máquina antes de fazer os próximos processos.
> A forma como ele é instalado diferencia de SO para SO, distro para distro ou vice-versa. Pesquise como fazer.

No seu arquivo `.env`, adicione:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
```

---

### 🧱 Comandos principais

| Ação                        | Comando                                               |
|----------------------------|--------------------------------------------------------|
| Gerar nova migration       | `pnpm dlx prisma migrate dev --name nome_da_migration`     |
| Aplicar migrations (prod)  | `pnpm dlx prisma migrate deploy`                           |
| Regenerar client Prisma    | `pnpm dlx prisma generate`                                 |
| Acessar interface visual   | `pnpm dlx prisma studio`                                   |

---

### 🛠️ Ambiente clonado

Após clonar o projeto, configurar o `.env` e rodar:

```bash
pnpm install
pnpm dlx prisma migrate deploy
```

O projeto já está disponível para uso!

---

### 🚀 Seed (futuro)

O projeto poderá usar seeds (mocks de dados) com:

```bash
npx prisma db seed
```

---
> ⚠️ O diretório `generated/` onde o Prisma Client é salvo está no `.gitignore` e será gerado automaticamente via `prisma generate`.