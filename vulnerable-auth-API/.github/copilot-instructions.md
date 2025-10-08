## Repo quick-start for AI coding agents

This Node.js + Express microservice is a deliberately vulnerable authentication API used for learning DevSecOps pitfalls.
Keep advice tightly focused on the code present (do not invent missing envs or services).

High-level architecture
- Single-process Express app that connects to MongoDB (see `app.js`).
- Routes: `routes/authRoutes.js` (public auth endpoints) and `routes/adminRoutes.js` (admin endpoints).
- Controllers: `controllers/authcontroller.js` contains registration, login and profile logic (vulnerable on purpose).
- Data model: `models/User.js` is a Mongoose model. Password hashing is intentionally disabled in comments.
- Docker: multi-stage Dockerfile builds in `node:20` and produces `node:20-slim` runtime image; it creates a non-root `appuser` and then switches to it (`USER appuser`).

Conventions and important patterns (project-specific)
- Environment: `.env` values are expected by `app.js` (MONGO_URI, PORT). Do not assume other services. The app expects MongoDB to be reachable.
- Security/intent: The controller intentionally contains insecure patterns (hard-coded JWT secret `insecure_secret`, plain-text password comparison, returned user objects including passwords). When changing behavior, keep tests or documentation that the change is intentional.
- CORS: Frontend origin is hard-coded to `http://localhost:5173` in `app.js`. Update carefully if adjusting frontend dev tooling.
- Scripts: `package.json` contains no start script — runtime uses the Dockerfile `CMD [