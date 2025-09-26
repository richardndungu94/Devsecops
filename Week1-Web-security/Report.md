## Building the vulnerable application

This week focus is to build a vulnerable API.

This task helps understatnd security flaws from both developer and attackers perspectives.

The API is vulnerable to various OWASP Top 10 Vulnerablities,and OWASP API top ten.


## The weeks tasks:

. Develope application with Node.js,create UI log in page
. Intentionally add the owasp top 10 vulnerabilities
. Interact with the API to find  out what security flaws were injected.

## The OWASP vulnerabilities

- No input validation (unsanitized user input).
  - Impact: enables NoSQL injection, XSS in any HTML output, malformed data, bypasses.
  - Test:payload like    < "username": "$gt": "">
  - Fix: validate input server-side (Zod/Joi/express-validator); sanitize strings; reject unexpected types.

- Sensitive information discolure;
  - Impact: leaked database credentials, JWT secrets, API keys. The repo contains a .env file in the tree (committed)
  - How to test: check repo for .env, check responses for leaked config, attempt to read .env endpoints if served.
  - Fix: remove .env from repo, add to .gitignore, rotate all secrets, use vault or CI secrets.

- Error information leakage (stack traces / backend error messages returned).
  - Impact- Returns rack backend error
  - How to test: send malformed requests and view error responses 
  - Fix: in production return generic error messages and log details server-side only; use a structured logger.

  
- Insecure Direct Object Reference (IDOR) / broken access control.
  - Impact: users can access/modify other users’ data by changing IDs in URLs or payloads.
  - Test: Register two accounts, try GET/PUT on /users/:id using the other user’s id.
  - Fix: enforce authorization checks (owner or role) on every resource access; don’t trust client-supplied ids

- Hardcoded & exposed credentials / weak/constant secrets (e.g. JWT secret).
  - Impact: attacker can forge tokens or login with backdoored credentials.
  - How to test: search code for strings like secret, JWT, tokens; try to craft JWTs with guessed secret.
  - Fix: keep secrets out of code, rotate secrets, use strong random secrets.

- Weak password handling / missing hashing / poor password policy
  - Impact: plaintext or weakly hashed passwords expose users on compromise.
  - How to test: use postman to find the exposed passwords.
  - Fix: use bcrypt/argon2 for encryption,enforce strong password policy & rate limit attempts
  - 
- Missing authentication middleware / routes unprotected.
  - Impact: protected endpoints accessible without tokens.
  - How to test: call endpoints that should be protected (e.g. /me, /profile) without token and see if data returns.
  - Fix: ensure middleware applied to protected routes; fail-closed default.

- No rate limiting / brute-force protection.
  - Impact: easy credential stuffing / brute force login.
  - How to test: script repeated login attempts and watch responses/locks.
  - Fix: implement rate limiting on auth endpoints (express-rate-limit), account lockout, CAPTCHA where appropriate.

## Summary 
Building a vulnerable app gives hands on experience to see the common mistake developers make when building an application and how attackers can exploit them








