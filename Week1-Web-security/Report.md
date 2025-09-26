Building the vulnerable application

This week focus was to build a vulnerable API.

This task helps understatnd security flaws from both developer and attackers perspectives.

The API is vulnerable to various OWASP Top 10 Vulnerablities,and OWASP API top ten.


The weeks tasks:

. Develope aplication with Node.js,create UI log in page
. Intentionally add the owasp top 10 vulnerabilities
. Interact with the API to find  out what security flaws were injected.

The OWASP vulnerabilities

- No input validation (unsanitized user input).
  Impact: enables NoSQL injection, XSS in any HTML output, malformed data, bypasses.
  Test:payload like    < "username": "$gt": "">
  Fix: validate input server-side (Zod/Joi/express-validator); sanitize strings; reject unexpected types.

- Sensitive information discolure;
  Impact: leaked database credentials, JWT secrets, API keys. The repo contains a .env file in the tree (committed)
  How to test: check repo for .env, check responses for leaked config, attempt to read .env endpoints if served.
  Fix: remove .env from repo, add to .gitignore, rotate all secrets, use vault or CI secrets.

- Error information leakage (stack traces / backend error messages returned).
  Impact- Returns rack backend error
  How to test: send malformed requests and view error responses 
  Fix: in production return generic error messages and log details server-side only; use a structured logger.

  
- Insecure Direct Object Reference (IDOR) / broken access control.
  Impact: users can access/modify other users’ data by changing IDs in URLs or payloads.
  Test: Register two accounts, try GET/PUT on /users/:id using the other user’s id.
  Fix: enforce authorization checks (owner or role) on every resource access; don’t trust client-supplied ids











