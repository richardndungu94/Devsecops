
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

- No rate-limiting and throttling on auth endpoints. Brute-force attempts or high request volumes could DOS

**Mitigations**
- Apply per-IP and per-account rate limits, stricter limits on login endpoints.
- Use middleware for the authentication routes

---

### Elevation of Privilege

- IDOR / mass-assignment risks: endpoints may accept `userId` or `role` fields from client input and allow unauthorized changes.

**Mitigations**
- Validate that resource access checks compare authenticated user's id to requested resource id. Use server-side lookup for sensitive actions.  
- Harden input parsing — use request body validators (e.g., `zod`, `joi`, `express-validator`) and whitelist allowed fields.


---

## Remediation Plan 

### Immediate (High impact, quick)
1. **Remove hard-coded secrets**:
2. **Enforce TLS**:
3. **Hash passwords correctly**: 
4. **Implement rate limiting on auth endpoints**
5. **Implement RBAC middleware and server-side authorization checks for admin endpoints**
6. **Validate JWT tokens strictly**
7. **Add request validation for all APIs (whitelisting allowed fields)**, remove mass-assignment.
8. **Sanitize outputs**: remove password from user objects returned by APIs.
9. **Secrets management (Vault)**, CI checks to prevent secrets in commits (pre-commit hooks & GitHub secret scanning).
10. **Centralized logging & alerting (detect abnormal admin actions, brute-force spikes)**.
11. **Harden network**: place DB in private subnet, use VPC, firewall rules, and rotate keys regularly.
12. **Add DAST/SAST to CI **(ZAP, Semgrep) and schedule periodic pentests.

---

## Controls, Detection & Monitoring
- Add failed-login counters and alerts. Block IPs with excessive failed attempts. citeturn5search11  
- Instrument admin endpoints with audit logs and alert on mass deletes or unusual patterns.  
- Integrate SAST & DAST in GitHub Actions for PR checks (Semgrep/OWASP ZAP).

---

## Appendix — Threat model image

