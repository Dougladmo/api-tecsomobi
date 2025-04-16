```markdown
# Tecsomobi Charging Points – API  
_Back‑end em Node.js + TypeScript • Prisma • SQLite • Express • Yup_

## Visão geral
Esta API REST fornece todas as operações de **CRUD** necessárias para gerenciar pontos de recarga de cartão (“charging points”) e o usuário administrador do sistema.  
Ela é consumida por dois front‑ends (React + Vite) — um usando **MUI** e outro usando **Ant Design** — e compartilha o mesmo banco SQLite local por meio do ORM **Prisma**.

> 🔗 **Demo:** https://SEU‑DOMÍNIO‑AQUI/api  
> (substitua `SEU‑DOMÍNIO‑AQUI` pelo domínio que você hospedar)

---

## Stack
| Camada | Tecnologias | Observações |
|--------|-------------|-------------|
| Runtime | Node.js ≥ 18 | Modern ECMAScript, fetch nativo |
| Linguagem | TypeScript | Strict mode ativado |
| Framework | Express ^4.18 | Arquitetura em camadas (routes → controllers → services) |
| ORM | Prisma ^4.6 | Migrations, type‑safety |
| Banco | SQLite 3 | Arquivo `dev.db` no projeto |
| Auth | JSON Web Token ^9 | Bearer token (`Authorization: Bearer <jwt>`) |
| Hash | bcrypt ^5 | Hash da senha do admin |
| Validação | Yup ^0.32 | Schemas p/ body e params |
| Misc. | dotenv ^16 • cors ^2.8 | Config. env & CORS |

---

## Estrutura de pastas
```
.
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── config/         (env, prisma client)
│   ├── middlewares/    (auth, validation, error handler)
│   ├── modules/
│   │   ├── auth/       (routes, controller, service)
│   │   └── charging/   (routes, controller, service, dto)
│   ├── server.ts
│   └── app.ts
└── package.json
```

---

## Pré‑requisitos
* **Node.js** ≥ 18  ‒ [`nvm`](https://github.com/nvm-sh/nvm) recomendado  
* **npm** ≥ 9 (ou **pnpm** / **yarn**)

---

## Configuração rápida

1. **Clone** o repositório e instale dependências:
   ```bash
   git clone https://github.com/seu-usuario/tecsomobi-api.git
   cd tecsomobi-api
   npm install
   ```

2. **Variáveis de ambiente**  
   Copie `.env.example` para `.env` e preencha:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="sua‑chave‑ultra‑secreta"
   ```
   
3. **Gerar banco e migrar** (SQLite):
   ```bash
   npx prisma migrate dev --name init
   # ou para resetar
   # npx prisma migrate reset
   ```

4. **Seed opcional** (cria o admin padrão):
   ```bash
   npm run seed              # email: admin@gmail.com  senha: 1234
   ```

5. **Rodar em modo dev**:
   ```bash
   npm run dev               # ts-node-dev / nodemon
   # Porta default: 3333
   ```

---

## Scripts principais
| Comando | Descrição |
|---------|-----------|
| `dev` | Hot‑reload com `ts-node-dev` |
| `build` | Transpila para `dist/` |
| `start` | Executa build em produção |
| `seed` | Insere admin padrão |
| `prisma studio` | GUI para inspecionar o SQLite |

---

## Modelos Prisma

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
}

model ChargingPoint {
  id                 Int      @id @default(autoincrement())
  nome               String
  endereco           String
  tipoRecarga        String    @default("cartao")
  status             Boolean   @default(true)
  horarioFuncionamento String
  responsavelNome    String
  responsavelContato String
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

enum Role {
  ADMIN
}
```

---

## Endpoints

| Método & Rota | Descrição | Middleware |
|---------------|-----------|------------|
| **POST** `/auth/login` | Login do admin `{ email, password }` → `{ token }` | — |
| **GET** `/auth/me` | Dados do usuário autenticado | `ensureAuth` |
| **GET** `/charging-points` | Lista todos | `ensureAuth` |
| **GET** `/charging-points/:id` | Busca por ID | `ensureAuth` |
| **POST** `/charging-points` | Cria novo ponto | `ensureAuth + validate(schemaCreate)` |
| **PUT** `/charging-points/:id` | Atualiza ponto | `ensureAuth + validate(schemaUpdate)` |
| **DELETE** `/charging-points/:id` | Remove ponto | `ensureAuth` |

> **Regra de negócio:** `tipoRecarga` **sempre** deve ser `"cartao"`.  
> Yup garante que qualquer outro valor resulte em HTTP 400.

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
  "horarioFuncionamento": "06:00‑22:00",
  "responsavelNome": "Maria Silva",
  "responsavelContato": "+55 91 99999‑0000"
}
```

**Resposta 201**
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

---

## Boas práticas implementadas
* **Layered Architecture** – separação limpa de responsabilidades.  
* **Typed Request/Response** – DTOs em TypeScript + Prisma types.  
* **Yup Validation** – schemas declarativos, mensagens claras.  
* **Global Error Handler** – HTTP status codes consistentes.  
* **Password Hashing** – `bcrypt` com salt 10.  
* **JWT** – expira em 7 dias, armazenado em header Authorization.  
* **CORS** habilitado para domínios front‑end.  
* **Scripts** automáticos para migration + seed.  

