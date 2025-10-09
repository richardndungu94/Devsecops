### Cyber Security Project — AppSec, Cloud, and DevSecOps Projects

This repository contains a 5 week cyber security Appsec,Cloud Security and Devsecop hands on practice project that will enhance your skills on these domains. 

I did the project and now will help anyone intrested in gaining skills on these domains.

---

Each week is structured as a standalone project with:  
- Vulnerable app design  
- Api Exploitation 
- Fixes & mitigations  
- Reports  
- Evidence (screenshots, logs, diagrams)  

### Repository Structure

```
cybersecurity-portfolio/
│── README.md # Overview of portfolio
│── Week1-Web-Security/
│ │── vulnerable-app/ # Node.js code with OWASP Top 10 issues
│ │── exploits/ # Burp Suite or ZAP exports/screenshots
│ │── REPORT.md # Documentation & mitigations
│
│── Week2-Auth-RBAC/
│ │── auth-app/ # JWT + RBAC implementation
│ │── tests/ # Exploit scripts (JWT manipulation, privilege escalation)
│ │── REPORT.md
│
│── Week3-API-Security/
│ │── api-app/ # REST API with intentional flaws
│ │── threat-model/ # Threat Dragon JSON + diagrams
│ │── REPORT.md
│
│── Week4-Cloud-Security/
│ │── deployment/ # Terraform/Docker configs or cloud notes
│ │── misconfig-exploits/ # Screenshots of S3 misconfig, SG exploits
│ │── REPORT.md
│
│── Week5-SAST-DAST/
│ │── sast/ # Semgrep/SonarQube results
│ │── dast/ # ZAP scan reports
│ │── ci-cd/ # GitHub Actions workflows
│ │── REPORT.md
│
│── FINAL-PORTFOLIO.pdf
```
##  Goals

The goal of the project is to help :

- Demonstrate **cyber security knowledge** across different domains (Web, APIs, Cloud, DevSecOps).  
- To show the ability to exploit, patch, and validate vulnerabilities.  
- Practice industry tooling: Burp Suite, OWASP ZAP, Semgrep, SonarQube, GitHub Actions, Terraform, Docker,etc.  

---

##  Weekly Breakdown

###  Week 1 — Web Security
- **Focus:** OWASP Top 10 (XSS, SQLi, CSRF, Insecure Headers).  
- **Artifacts:** Node.js vulnerable app, Burp/ZAP exploit files, mitigation patches.  
- **Deliverable:** `Designing a vulnerable app,documenting each vuln, exploit steps, fixes, and verification.

###  Week 2 — Authentication & RBAC
- **Focus:** JWT, session security, and role-based access control.  
- **Artifacts:** Exploit scripts for JWT tampering, privilege escalation.  
- **Deliverable:** Report analyzing common auth flaws and hardened implementation.

###  Week 3 — API Security
- **Focus:** REST API threats (rate limiting, injection, broken auth, mass assignment).  
- **Artifacts:** Vulnerable API, Threat Dragon diagrams, Postman exploit collections.  
- **Deliverable:** Threat model + API security assessment.

###  Week 4 — SAST & DAST
- **Focus:** Automated security testing in CI/CD.  
- **Artifacts:** Semgrep/SonarQube static scan results, ZAP DAST reports, GitHub Actions workflow.  
- **Deliverable:** Report + working CI/CD pipeline that runs scans on push/PR.


###  Week 5— Cloud Security
- **Focus:** Misconfigurations in cloud deployments,IAM ,least privileges.  
- **Artifacts:** AWS repo configuration,IAM,Docker 
- **Deliverable:** Deploy application in aws,ensure secure deployment.

---



## 🛠️ Tools & References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)  
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)  
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)  
- [OWASP ZAP](https://www.zaproxy.org/)  
- [Semgrep](https://semgrep.dev/)  
- [Threat Dragon](https://owasp.org/www-project-threat-dragon/)   
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)  

---

## This repository is designed to **demonstrate hands-on AppSec expertise**.  
- Each week shows a full exploit–patch–validate cycle.  
- Reports highlight both **technical depth** and **communication skills**   
- CI/CD workflows demonstrate **DevSecOps mindset**.  


