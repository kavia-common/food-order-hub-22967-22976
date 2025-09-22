# Food Order Hub API (Express) — Ocean Professional

Modern REST API for food ordering:
- Auth: register, login (Bearer token)
- Menu: browse, admin CRUD
- Orders: place, track, admin status updates

Docs: visit /docs when the server is running.

Auth
- POST /auth/register { name, email, password }
- POST /auth/login { email, password } -> { token, user }

Menu
- GET /menu
- GET /menu/{id}
- POST /menu (admin)
- PUT /menu/{id} (admin)
- DELETE /menu/{id} (admin)

Orders
- GET /orders (user: own orders; admin: all)
- POST /orders { items: [{menuItemId, quantity}], notes?, deliveryMethod? }
- GET /orders/{id}
- PATCH /orders/{id}/status (admin) { status }
- POST /orders/{id}/cancel

Theming: Swagger UI customized to Ocean Professional palette:
- Primary #2563EB, Secondary #F59E0B, Error #EF4444, Background #f9fafb, Text #111827

Future .env (not required now)
- PORT: HTTP port.
- HOST: Bind address.
- JWT_SECRET: Secret to sign JWTs (replace pseudo-tokens).
- TOKEN_EXPIRES_IN: Token TTL seconds (e.g. 3600).
- DB_URL: Database connection string when migrating away from in-memory storage.

Security note
- Current implementation uses a simple hashed password and pseudo JWT to avoid extra deps.
- Replace with bcrypt/argon2 and jsonwebtoken for production.
