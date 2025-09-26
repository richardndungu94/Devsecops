Building the vulnerable application

This week focus was to build a vulnerable API.

This task helps understatnd security flaws from both developer and attackers perspectives.

The API is vulnerable to various OWASP Top 10 Vulnerablities,and OWASP API top ten.


The weeks tasks:

. Develope aplication with Node.js,create UI log in page
. Intentionally add the owasp top 10 vulnerabilities
. Interact with the API to find  out what security flaws were injected.

The OWASP vulnerabilities

Brocken Access Control
The API displays password in plain text, this can help attacker break easily in the application

Exesive information discolure;
the API leakes information from the backend that should not be leaked.
this is the most common rik in an API, an API can return information that is not intended ,this could lead to sensitive information disclosure like passwords,secretes, jwt
Input validation
API does not validate iputs and any malicious script can be injected

The API can accept passswords like 12345 which is easy for atackers to navigate
F







