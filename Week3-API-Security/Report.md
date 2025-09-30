
# Threat Model — vulnerable-auth-API

---

# TASK

Implement threat model for the vulnerable api


## Executive Summary 

This threat model examines the vulnerable API

- **Broken Authentication & Authorization** (IDOR, JWT tampering, hard-coded secret) — *Critical*.  
- **Sensitive data exposure** (passwords / DB leakage, lack of cryptographic storage) — *Critical*.  
- **Transport security absent or weak (HTTP, no TLS/HSTS)** — *High / Critical*.  
- **Lack of rate-limiting & brute-force protections** — *High*.  
- **Server / configuration vulnerabilities: unsecured MongoDB, hard-coded secrets** — *High*.  
- **Potential DoS / resource exhaustion** — *Medium/High*.

This report maps threats → root cause → recommended fixes (code + configuration), detection, and a verification checklist.

---

## Scope & Assumptions
- Scope: `vulnerable-auth-API`   


---

## Assets & Trust Boundaries
**Assets**
- User credentials (email, password)
- JWT access tokens
- User profile data (id, email, personal fields)
- Admin functionality (delete users, view users)
- Server (app runtime) and MongoDB datastore
- Logs and backups

**Trust boundaries**
- Client ↔ API (authentication, session tokens, transport)
- API ↔ MongoDB (database access)
- Admin UI/API ↔ Backend (admin privilege boundary)
- Internal components (e.g., environment/config) ↔ source code

---

## STRIDE Analysis (mapped to concrete findings)

### Spoofing (Authentication)

- JWT secret is weak and hard-coded. Attackers can forge tokens to impersonate users or escalate to admin.

**Attack scenario**
1. Attacker obtains repo or reads code/environment and finds hard-coded secret.  
2. Attacker crafts a JWT with `role: admin` and signs with discovered secret → full admin access.

**Mitigations**
- Move secrets out of code into environment/secret store.Rotate secrets.
- Use a strong signing key. Implement least-privilege for admin routes.

---

### Tampering

- Server and database configuration may allow tampering (publicly accessible MongoDB, insecure server configs). 

**Attack scenario**
- Exposed MongoDB instance with no auth → attacker reads or modifies user data.

**Mitigations**
- Require authentication on DB (MongoDB auth) and bind to localhost or use VPC/subnet rules.  
- Use secure filesystem permissions and harden the server OS.  
- Use config management to avoid secrets in source.


---

### Information Disclosure

- Passwords stored insecurely (plaintext).

**Mitigations**
- Replace any reversible/weak hashing with a modern password hashing function: **Argon2**, **bcrypt**. 
- Remove sensitive fields from API responses (never echo password hashes, never expose internal IDs where possible).  
- Implement logging filters to avoid logging secrets.


---

### Denial of Service (DoS)

- No rate-limiting and throttling on auth endpoints. Brute-force attempts or high request volumes could cause service outage. (Repo README lacks rate-limiting notes.)

**Mitigations**
- Apply per-IP and per-account rate limits, stricter limits on login endpoints. Use `express-rate-limit` or `rate-limiter-flexible`. Consider progressive delays for failed attempts and account lockouts with notification. citeturn5search3turn5search11

**Verification**
- Ensure middleware present in `app.js`/`server.js` and configured for login/register routes.  
- Run a simple load test (locally) to observe behavior under high request rates.

---

### Elevation of Privilege
**Findings**
- IDOR / mass-assignment risks: endpoints may accept `userId` or `role` fields from client input and allow unauthorized changes. Sample report explicitly calls out IDOR.

**Mitigations**
- Validate that resource access checks compare authenticated user's id to requested resource id. Use server-side lookup for sensitive actions.  
- Harden input parsing — use request body validators (e.g., `zod`, `joi`, `express-validator`) and whitelist allowed fields.

**Verification**
- Add automated tests to attempt access to other users’ records (expect 403).  
- Review controllers for places where `req.body` is used directly to update DB (e.g., `User.updateOne(req.body)`).

---

## Prioritized Remediation Plan (quick wins → medium → long-term)

### Immediate (High impact, quick)
1. **Remove hard-coded secrets**: move `JWT_SECRET` to env vars and revoke/change the secret if leaked. Use `.env` with `.gitignore`. Implement secrets manager for production. citeturn5search16  
2. **Enforce TLS**: ensure the app only accepts HTTPS, add HSTS header and redirect HTTP → HTTPS. citeturn5search2turn5search14  
3. **Hash passwords correctly**: re-hash existing passwords on next login with Argon2 or bcrypt; block plaintext passwords. citeturn5search1  
4. **Implement rate limiting on auth endpoints** (login/register). citeturn5search3

### Short-term (Code changes, tests)
1. Implement RBAC middleware and server-side authorization checks for admin endpoints.  
2. Validate JWT tokens strictly: check `alg`, `iss`, `aud`, `exp`, and signature. Prefer asymmetric signing for high-privilege tokens. citeturn5search4turn5search12  
3. Add request validation for all APIs (whitelisting allowed fields), remove mass-assignment.  
4. Sanitize outputs: remove password from user objects returned by APIs.

### Long-term (Operational / architecture)
1. Secrets management (Vault), CI checks to prevent secrets in commits (pre-commit hooks & GitHub secret scanning). citeturn5search16  
2. Centralized logging & alerting (detect abnormal admin actions, brute-force spikes).  
3. Harden network: place DB in private subnet, use VPC, firewall rules, and rotate keys regularly.  
4. Add DAST/SAST to CI (ZAP, Semgrep) and schedule periodic pentests.

---

## Controls, Detection & Monitoring
- Add failed-login counters and alerts. Block IPs with excessive failed attempts. citeturn5search11  
- Instrument admin endpoints with audit logs and alert on mass deletes or unusual patterns.  
- Integrate SAST & DAST in GitHub Actions for PR checks (Semgrep/OWASP ZAP).

---

## Example Code Snippets (fixes)

**Move JWT secret to env (Node.js)**  
```js
// bad: const JWT_SECRET = 'myhardcodedsecret';
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET not set');
```

**Use bcrypt (registration)**  
```js
const bcrypt = require('bcrypt');
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '12', 10);
// on register
const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
// store hashed
```

**Strict token verification (jsonwebtoken)**  
```js
const jwt = require('jsonwebtoken');
function verifyToken(token){
  const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  // additionally check issuer/audience
  if(payload.iss !== 'your-app') throw new Error('invalid issuer');
  return payload;
}
```

**Express rate-limit for login**  
```js
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: 'Too many login attempts, try again later'
});
app.post('/login', loginLimiter, loginHandler);
```

---

## Attack Trees / Example test cases
1. **JWT forge**: Attempt to sign token with known secret → call admin delete user endpoint → expect 403 (must be 401/403).  
2. **IDOR**: Auth as user A, call `/users/:id` for user B → expect 403.  
3. **Password leak**: Try to login with plaintext from DB dump → should not authenticate unless password reused and matches hash.  
4. **Rate limit**: Run automated failed login attempts from single IP → should be rate-limited.

---

## Verification Checklist (what to run after fixes)
- [ ] Secrets removed from codebase (scan via `git grep`/GitHub secret scanning).  
- [ ] JWT secret rotated, tokens invalidated.  
- [ ] Passwords stored with bcrypt/argon2 and verified.  
- [ ] HTTPS enforced, HSTS header present.  
- [ ] Rate-limiting in place on auth endpoints.  
- [ ] RBAC checks present for all admin routes.  
- [ ] Pen-test for IDOR and token tampering passes (no privilege escalation).  
- [ ] CI SAST rules enforced; no high-confidence secrets or risky patterns.

---

## Appendix — Sources / References
- OWASP: Testing JSON Web Tokens & JWT guidance. citeturn5search0turn5search4  
- OWASP Password Storage Cheat Sheet. citeturn5search1  
- OWASP Transport Layer Security Cheat Sheet & HSTS. citeturn5search2turn5search14  
- MDN / Express rate-limiting guidance & Express security best practices. citeturn5search3turn5search11  
- Semgr
