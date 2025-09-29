# Auth & Role Based Acces control (RBAC)

This weeek taks in this Devsecops priject was to build access control for the vulnerable API. 
I built the admin end point to enale the admin to get users and delete them
these roles are to be assigned to admins specifically but this is not the case as attackes have wasy to eszalate privileges
---

# Executive summary
Weak RBAC and related issues (hardcoded/weak JWT secrets, missing ownership checks, IDOR) lead to:

- **Privilege escalation** (forge tokens → admin access).  
- **Unauthorized data disclosure** (user A reads user B).  
- **Destructive operations** (delete/modify other users).  

Business impact: PII exposure, regulatory fines, reputational damage, and full compromise in worst cases. These problems primarily map to **Broken Access Control** and **Broken Authentication** in OWASP lists.

---

# What is RBAC (Role-Based Access Control)?
RBAC assigns permissions to *roles* (e.g., `user`, `admin`) and assigns roles to identities. Secure RBAC requires:

- Server-side enforcement of role checks (never trust client-supplied role claims without verification).  
- Ownership checks for resources belonging to specific users.  
- Least privilege: roles only have required permissions.  
- Secrets/tokens used to assert roles must be protected and validated.

---

# What is IDOR (Insecure Direct Object Reference)?
IDOR occurs when APIs accept an identifier (e.g., `/users/:id`) and return the referenced object without checking whether the requester is authorized to access that object. Result: trivial data access and enumeration by changing identifiers.

---

# Broken Access Control — overview
Broken Access Control = when the app fails to enforce *who* can do *what*. Common symptoms:

- No ownership check on resource endpoints.  
- Authorization decisions based only on claims that can be forged.  
- Endpoints returning more data than necessary (excessive exposure).  
- Missing server-side enforcement of role/permission logic.

---

# Typical weaknesses & effects (seen in the lab app)
1. **Hardcoded / weak JWT secret** — attacker who learns the secret can forge tokens with arbitrary claims (e.g., `role: "admin"`).  
2. **IDOR on `GET /users/:id`** — any authenticated user can fetch other users’ profiles.  
3. **Insufficient authorization on `DELETE /users/:id`** — deletions may be possible by unauthorized users.  
4. **Excessive data exposure** — endpoints return sensitive fields unnecessarily.  
5. **Long-lived tokens / no revocation** — compromised tokens remain usable for too long.

---

# How these can be exploited (high-level, lab-only)
**Token forging (weak secret)**  
- Find hardcoded secret in source or commit history → craft JWT with `role: admin` → call admin endpoints (`GET /users`, `DELETE /users/:id`) → full control.

**IDOR**  
- Authenticate as user A → call `GET /users/<userB-id>` → server returns user B data if no ownership check.

**Chained attack**  
- Use IDOR to enumerate targets → forge tokens to escalate privileges → perform destructive actions.

> Keep PoCs sanitized and confined to lab/test folders. Do not publish raw exploit scripts in public README or public repos.

---

# OWASP Web/API Top 10 mapping (relevant items)
- **Broken Access Control (API1 / A01)** — RBAC fails, IDOR, missing ownership checks.  
- **Broken Authentication (API2 / A02)** — weak/hardcoded tokens enable authentication bypass.  
- **Excessive Data Exposure (API3 / A03)** — returning full objects increases risk.  
- **Security Misconfiguration (API5 / A05)** — secrets in source, dev configs.  
- **Insufficient Logging & Monitoring (API10 / A09)** — lack of alerts for suspicious admin activity.

---

# Prioritized mitigations (actionable)

## Immediate (must-fix)
1. **Remove hardcoded secrets**  
   - Read `JWT_SECRET` from environment; fail startup if missing or weak (min length e.g., 32 chars).

2. **Enforce ownership + role checks**  
   - Middleware pattern: `if (user.role === 'admin' || user.id === params.id) allow; else 403`.

3. **Limit returned fields**  
   - Use DTOs: only return fields required by the client.

4. **Use short-lived access tokens**  
   - Example: access token `expiresIn: '15m'` with a secure refresh flow.

## Short term
- Add pre-commit & CI secret scanning.  
- Implement rate-limiting (esp. on lookup endpoints).  
- Validate and normalize path params.

## Medium / long term
- Consider asymmetric signing (RS256) with keys in a KMS.  
- Centralize RBAC with a policy engine/library.  
- Implement token revocation (blacklist/whitelist).

---

# Detection & monitoring guidance
- Log signature failures, malformed tokens, and token-claim mismatches.  
- Alert on sensitive operations (DELETE /users) and on anomalous patterns (many different `:id` reads from same token/IP).  
- Monitor unusual admin-level token use from new IPs or times.  
- Periodic repository scans for secrets and RBAC regression tests.

---

# Tests to add (automated checklist)
**Authentication**
- Reject tokens with invalid signature → `401`.  
- Reject expired tokens → `401`.

**Authorization**
- `user` cannot access `GET /users` (admin-only) → `403`.  
- `user` cannot access `GET /users/:otherId` → `403`.  
- `admin` can access `GET /users` → `200`.  
- `DELETE /users/:id` allowed only for owner or admin.

**CI checks**
- Fail build if `JWT_SECRET` appears in repo (grep/secret-scan).  
- Regression tests that assert DTO shape (only allowed fields returned).

---

# Safe PoC policy (how to document PoCs)
- Keep PoC code in `tests/pocs/` and label `LAB-ONLY`.  
- PoC docs should include: **Objective**, **Environment** (local/dev only), **High-level method** (non-actionable), **Sanitized result**, **Remediation status**.  
- Never publish raw secret values, private keys, or full exploit scripts in public README or public repos.

---

# Severity & business impact
- **Hardcoded secret + IDOR = High severity.** Possible account takeover, mass data exposure, destructive ops.  
- Business consequences: regulatory fines (PII), loss of user trust, financial loss, and reputational damage.

---

# Suggested immediate next steps
1. Remove hardcoded `JWT_SECRET` and require env config.  
2. Implement `requireOwnerOrAdmin` middleware and apply to `GET /users/:id` and `DELETE /users/:id`.  
3. Add short-lived tokens + refresh flow.  
4. Add automated authorization tests and CI secret scans.  
5. Move PoCs to a lab-only `tests/pocs/` folder and label clearly.

---

# Appendix — small secure code snippets

**Require owner or admin middleware**
```js
// middleware/requireOwnerOrAdmin.js
function requireOwnerOrAdmin(req, res, next) {
  const requesterId = String(req.user.id);
  const targetId = String(req.params.id);
  if (req.user.role === 'admin' || requesterId === targetId) return next();
  return res.status(403).json({ error: 'Forbidden' });
}
module.exports = requireOwnerOrAdmin;
```

**Fail-fast on missing secret**
```js
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('FATAL: set a strong JWT_SECRET'); process.exit(1);
}
```

**Short-lived token signing**
```js
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);
```
