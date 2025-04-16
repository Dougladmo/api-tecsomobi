# Tecsomobi Charging Points – API

**Back‑end em Node.js + TypeScript • Prisma • SQLite • Express • Yup**

---

## 📋 Visão Geral
Esta API REST oferece operações de **CRUD** para gerenciar pontos de recarga de cartão urbano e o usuário administrador do sistema. É consumida por duas interfaces front‑end em React (MUI e Ant Design), compartilhando o mesmo banco SQLite local via Prisma.

## 🛠️ Stack
| Camada        | Tecnologias                           | Observações                                               |
|---------------|---------------------------------------|-----------------------------------------------------------|
| **Runtime**   | Node.js ≥ 18                          | ECMAScript moderno, fetch nativo                          |
| **Linguagem** | TypeScript                            | Strict mode ativado                                       |
| **Framework** | Express ^4.18                         | Arquitetura em camadas (routes → controllers → services)  |
| **ORM**       | Prisma ^4.6                           | Migrations, type‑safety                                   |
| **Banco**     | SQLite 3                              | Arquivo `dev.db` no projeto                               |
| **Auth**      | JSON Web Token ^9                     | Bearer token (`Authorization: Bearer <jwt>`)              |
| **Hash**      | bcrypt ^5                             | Hash de senha com salt 10                                 |
| **Validação** | Yup ^0.32                             | Schemas para body e params                                |
| **Misc.**     | dotenv ^16 • cors ^2.8                | Configuração de variáveis e CORS                          |

## 📁 Estrutura de Pastas
```
.
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── config/         # Env, Prisma Client
│   ├── middlewares/    # Auth, validação, handler de erros
│   ├── modules/
│   │   ├── auth/       # routes, controller, service
│   │   └── charging/   # routes, controller, service, DTOs
│   ├── server.ts
│   └── app.ts
└── package.json
```

## ⚙️ Pré‑requisitos
- **Node.js** ≥ 18 (recomendado `nvm`)
- **npm** ≥ 9 (ou pnpm / yarn)

## 🚀 Configuração Rápida
1. **Clone e instale dependências**:
   ```bash
   git clone https://github.com/seu-usuario/tecsomobi-api.git
   cd tecsomobi-api
   npm install
   ```
2. **Variáveis de ambiente**:
   - Copie `.env.example` → `.env` e preencha:
     ```env
     DATABASE_URL="file:./dev.db"
     JWT_SECRET="sua-chave-ultra-secreta"
     ```
3. **Banco e migrations**:
   ```bash
   npx prisma migrate dev --name init
   # ou reinicie o banco:
   # npx prisma migrate reset
   ```
4. **Seed opcional (admin padrão)**:
   ```bash
   npm run seed
   # email: admin@gmail.com | senha: 1234
   ```
5. **Modo de desenvolvimento**:
   ```bash
   npm run dev
   # Porta padrão: 3333
   ```

## ⚡ Scripts Úteis
| Script               | Descrição                                  |
|----------------------|--------------------------------------------|
| `npm run dev`        | Hot-reload com ts-node-dev / nodemon       |
| `npm run build`      | Transpila para `dist/`                     |
| `npm start`          | Executa build em produção                 |
| `npm run seed`       | Insere admin padrão                        |
| `npx prisma studio`  | GUI para inspecionar o banco SQLite        |

## 📊 Modelos Prisma
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
}

model ChargingPoint {
  id                   Int      @id @default(autoincrement())
  nome                 String
  endereco             String
  tipoRecarga          String   @default("cartao")
  status               Boolean  @default(true)
  horarioFuncionamento String
  responsavelNome      String
  responsavelContato   String
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}

enum Role {
  ADMIN
}
```

## 📬 Endpoints
| Método & Rota                     | Descrição                    | Middleware                                       |
|-----------------------------------|------------------------------|--------------------------------------------------|
| **POST** `/auth/login`            | Login do admin               | —                                                |
| **GET** `/auth/me`                | Dados do usuário autenticado | `ensureAuth`                                     |
| **GET** `/charging-points`        | Lista todos                  | `ensureAuth`                                     |
| **GET** `/charging-points/:id`    | Busca por ID                 | `ensureAuth`                                     |
| **POST** `/charging-points`       | Cria novo ponto              | `ensureAuth` + `validate(schemaCreate)`          |
| **PUT** `/charging-points/:id`    | Atualiza ponto               | `ensureAuth` + `validate(schemaUpdate)`          |
| **DELETE** `/charging-points/:id` | Remove ponto                 | `ensureAuth`                                     |

> **Regra de negócio:** o campo `tipoRecarga` deve ser **"cartao"**. Qualquer outro valor retorna HTTP 400.

### Exemplo de Criação
```http
POST /charging-points
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "nome": "Quiosque Terminal Sul",
  "endereco": "Av. Alcides Costa, 1234 - Belém/PA",
  "tipoRecarga": "cartao",
  "status": true,
  "horarioFuncionamento": "06:00-22:00",
  "responsavelNome": "Maria Silva",
  "responsavelContato": "+55 91 99999-0000"
}
```
**Resposta 201:**
```json
{
  "id": 7,
  "nome": "Quiosque Terminal Sul",
  "endereco": "Av. Alcides Costa, 1234 - Belém/PA",
  "tipoRecarga": "cartao",
  "status": true,
  "horarioFuncionamento": "06:00-22:00",
  "responsavelNome": "Maria Silva",
  "responsavelContato": "+55 91 99999-0000",
  "createdAt": "2025-04-16T23:02:41.915Z",
  "updatedAt": "2025-04-16T23:02:41.915Z"
}
```

## 🌟 Boas Práticas Implementadas
- **Layered Architecture:** separação clara de responsabilidades.
- **Typed Requests/Responses:** DTOs em TypeScript + tipos Prisma.
- **Yup Validation:** schemas declarativos e mensagens claras.
- **Global Error Handler:** códigos de status HTTP consistentes.
- **Segurança:** bcrypt (salt 10) + JWT (expira em 7 dias).
- **CORS:** habilitado para front-ends.
- **Scripts:** automatização de migrations e seed.

---

_Criado para o desafio técnico Tecsomobi_
