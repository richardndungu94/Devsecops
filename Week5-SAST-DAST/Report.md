# DevSecOps CI/CD Security Pipeline

This week's task was to implement **DevSecOps**  by integrating **security checks early in the SDLC (Shift Left)**

# Task

Integrate multiple security scanners:
- SAST:Static Application Security Test
- SCA-Software Composition Analyis
- Secret scanner
- Container Scanning
- DAST-Dynamic Application Security Test



---

## Tools 

To implement as a secure CI/CD the i used the following tools:

- **GitLab CI/CD** → Orchestrates the entire pipeline via `.gitlab-ci.yml`.  
- **Docker** → Builds container images for reproducible deployments and container security testing.  
- **Semgrep (SAST)** → Performs **static application security testing**, detecting insecure coding patterns and vulnerabilities (e.g., OWASP Top 10).  
- **GitLab Dependency Scanning (SCA)** + **Snyk** → Scans third-party dependencies for known CVEs.  
- **GitLab Container Scanning** (Trivy) → Scans Docker images for vulnerable base layers and system packages.  
- **GitLeaks / GitLab Secrets Scanning** → Detects exposed API keys, passwords, and credentials in code.  
- **GitLab DAST** → Performs **dynamic application security testing** against a running app to catch runtime flaws (e.g., XSS, SQLi).  

---

##  Security Stages in CI/CD

### 1. **Static Application Security Testing (SAST)**
- Implemented using **Semgrep**,**Synk**, and GitLab’s SAST template.  
- Runs against source code before build.  
- Detects:
  - Insecure functions
  - Hardcoded secrets
  - Insecure configs  
- **Output:** `semgrep-report.json` → uploaded as a GitLab security report.

### 2. **Software Composition Analysis (SCA)**
- Implemented with **GitLab Dependency Scanning** + **Snyk**.  
- Identifies vulnerabilities in third-party packages (`npm`, `pip`, etc).  
- Prevents shipping code with vulnerable dependencies (e.g., `lodash`, `flask`).  
- **Output:** `snyk-report.json` and GitLab dependency scanning report.

### 3. **Container Scanning**
- Uses **Trivy** via GitLab’s `container_scanning` template.  
- Scans built Docker images for:
  - Vulnerable OS packages (e.g., Alpine, Debian)
  - Misconfigured Dockerfiles  
- Ensures container baseline security before deployment.  

### 4. **Secret Scanning**
- Uses **GitLeaks** / GitLab secret detection.  
- Detects:
  - API keys
  - Passwords
  - Tokens accidentally committed  
- Prevents credential leaks into VCS history.  

### 5. **Dynamic Application Security Testing (DAST)**
- GitLab DAST scanner targets the **running app**.  
- Detects:
  - Cross-Site Scripting (XSS)
  - SQL Injection (SQLi)
  - Insecure redirects
- Simulates attacker interactions in runtime.
- OWASP ZAP was used to scan the application

---

## Handling False Positives

Security scanners can report **false positives** which can cause panic during software development,
The following are the  Strategies used to tackle false positives:

- **Review in Merge Requests:** GitLab surfaces results in MR reports for developer review.  
- **Severity Prioritization:** Focus on *High* and *Critical* first.  
- **Baselining:** Ignore known non-exploitable findings using `allowlist` in Semgrep or `--ignore-policy` in Snyk.  
- **Continuous Tuning:** Update rulesets and configs regularly to reduce noise.  
- **Contextual Analysis:** Developers and security engineers jointly validate findings before remediation.

---

## 🔄 Shifting Security Left

By embedding these tools directly into GitLab pipelines, **security is integrated from the earliest stages of development**. Benefits include:  
- **Early Detection:** Issues caught before production.  
- **Cost Reduction:** Fixing in dev is cheaper than post-deploy.  
- **Continuous Security:** Every commit is scanned automatically.  
- **Developer Empowerment:** Developers see feedback immediately and learn secure coding practices.  

---

## Impact on Secure SDLC

This project demonstrates how **DevSecOps pipelines reduce risk** by automating checks across the SDLC:  
- **Requirements →** Security policies defined.  
- **Code →** SAST + Secret scans.  
- **Build →** Container scans.  
- **Test →** SCA + DAST.  
- **Deploy →** Only verified artifacts are pushed.  


---

## References

These are the links to the scanners

- [GitLab Secure Stage](https://docs.gitlab.com/ee/user/application_security/)  
- [Semgrep](https://semgrep.dev/)  
- [Snyk](https://snyk.io/)  
- [Trivy](https://aquasecurity.github.io/trivy/)  
- [GitLeaks](https://github.com/gitleaks/gitleaks)  

---
## Appendix -Images

# Gitlab SAST scan

![Alt text](/Images/scan14.png)


# Semgrep

![Alt text](/Images/scan9.png)



# Synk

![Alt text](/Images/scan5.png)


# Scans

![Alt text](/Images/scan4.png)




