Risk Analysis — vulnerable-auth-API

## TASK

Analyze the risks associated with the vulnerable API

---
# Executive Summary 

This risk analysis identifies and prioritizes the risks in the vulnerable-auth-API using **likelihood
vs impact** scoring.
The application suffers from weak authentication, insecure data storage, missing rate-limiting,
and misconfigured server/database security.
Risks are rated **Critical, High, Medium, Low** based on STRIDE threats and OWASP Top 10
categories.


---
# Risk Matrix (Likelihood × Impact)
| Risk | Likelihood | Impact | Rating |
|------|------------|--------|--------|
| Hard-coded / weak JWT secret (token forgery) | High | Critical | **Critical** |
| Broken Access Control (IDOR, missing RBAC) | High | Critical | **Critical** |
| Plaintext / weak password storage | High | Critical | **Critical** |
| No TLS (HTTP only) | High | High | **High** |
| No rate limiting on login | High | High | **High** |
| Exposed MongoDB without auth | Medium | Critical | **High** |
| Sensitive data in logs | Medium | High | **Medium** |
| DoS via brute-force or resource exhaustion | Medium | High | **Medium** |
| Misconfigured local server / open ports | Medium | Medium | **Medium** |
| Missing audit logs (repudiation risk) | Low | Medium | **Low** |
---

# Detailed Risk Findings

1. **Hard-coded / Weak JWT Secret**
- **Risk:** Attackers forge tokens and escalate privileges (Spoofing/Elevation of Privilege).
- **Likelihood:** High — secret exposed in source code.
- **Impact:** Critical — full admin takeover.
- **Mitigation:** Move secret to env vars, use strong keys, rotate frequently.
  
2. **Broken Access Control (IDOR, Missing RBAC)**
- **Risk:** Users access or modify resources of others by guessing IDs or manipulating
requests.
- **Likelihood:** High.
- **Impact:** Critical — data theft, privilege escalation.
- **Mitigation:** Enforce strict server-side authorization checks, implement RBAC middleware.
  
3. **Insecure Password Storage**
- **Risk:** Passwords stored in plaintext.
- **Likelihood:** High.
- **Impact:** Critical — credential dumps → account takeover.
- **Mitigation:** Use bcrypt/argon2 with proper salts and iterations.
- 
4. **No TLS (HTTP only)**
- **Risk:** Man-in-the-middle attack intercepts login credentials.
- **Likelihood:** High.
- **Impact:** High — credential theft.
- **Mitigation:** Enforce HTTPS only with TLS 1.2+, add HSTS.
  
5. **No Rate Limiting on Login**
- **Risk:** Unlimited brute-force attempts.
- **Likelihood:** High.
- **Impact:** High — account compromise.
- **Mitigation:** Add express-rate-limit, account lockouts, and CAPTCHA for suspicious logins.
  
6. **Exposed MongoDB Without Auth**
- **Risk:** Attacker connects directly to DB, reads/modifies data.
- **Likelihood:** Medium.
- **Impact:** Critical — full data compromise.
- **Mitigation:** Bind DB to localhost/private subnet, require authentication, enforce TLS.
  
7. **Sensitive Data in Logs**
- **Risk:** Passwords, JWTs, or PII exposed in logs.
- **Likelihood:** Medium.
- **Impact:** High — insider threat or breach exposure.
- **Mitigation:** Sanitize logs, mask sensitive fields, restrict log access.
  
8. **Denial of Service**
- **Risk:** Flooding login/API requests exhausts server resources.
- **Likelihood:** Medium.
- **Impact:** High — outage, service disruption.
- **Mitigation:** Rate-limiting, WAF, autoscaling.
  
9. **Misconfigured Local Server / Open Ports**
- **Risk:** Attackers access MongoDB/Node.js services directly.
- **Likelihood:** Medium.
- **Impact:** Medium — lateral movement, server compromise.
- **Mitigation:** Restrict ports with firewall, expose only HTTPS.
  
10. **Missing Audit Logs**
- **Risk:** Admin or attackers can deny malicious activity.
- **Likelihood:** Low.
- **Impact:** Medium.
- **Mitigation:** Centralized, immutable audit logs.
---


# Risk Prioritization

- **Critical Risks:** Must be fixed immediately (JWT secret, Broken Access Control, Insecure
Password Storage).
- **High Risks:** Next priority (TLS enforcement, rate-limiting, DB security).
- **Medium Risks:** Address once critical/high resolved (logging, DoS, server misconfig).
- **Low Risks:** Add as ongoing improvements (audit logs).
---
# Recommendations
1. Remove secrets from code, use secret managers.
2. Enforce RBAC, validate user ownership on resources.
3. Store passwords securely (bcrypt/argon2).
4. Force HTTPS only, add HSTS headers.
5. Apply rate-limiting to login endpoints.
6. Harden DB and server configs.
7. Sanitize logs and secure backups.
8. Implement centralized monitoring, logging, and alerting
