---

#  Executive Summary — DevSecOps & Application Security Project

This five-week **DevSecOps / Application Security Engineering** project demonstrates end-to-end capability in identifying, exploiting, and remediating security vulnerabilities within a full-stack web API.

Through practical implementation, I built, analyzed, secured, and deployed a **vulnerable authentication API**—mimicking real-world enterprise application environments—to showcase my ability to operate across **AppSec, DevSecOps, Threat Modeling, Cloud Security**, and **Secure SDLC** domains.

---

## **Key Deliverables**

* Built a **vulnerable Node.js authentication API** to simulate OWASP Top 10 flaws.
* Implemented **RBAC, JWT auth**, and demonstrated **privilege escalation attacks** and mitigations.
* Developed full **Threat Model (STRIDE)** and **Risk Analysis** framework for the API.
* Integrated **CI/CD Security Pipeline (SAST, SCA, DAST, Secret & Container scanning)** using GitLab and industry-standard tools (Semgrep, Trivy, GitLeaks, Snyk).
* Deployed the application to **AWS ECR + ECS + S3 + CloudWatch** following **least-privilege IAM** and **secure networking** best practices.

---

#  Alignment to AppSec / DevSecOps Job Roles

This projects give strong emphasis on these domains:

### **1. Application Security Engineer**

* Performed **vulnerability identification, risk classification, and mitigation** aligned to **OWASP Top 10** and **CWE** standards.
* Built and secured APIs with **RBAC, JWT, input validation, rate limiting**, and **least privilege** enforcement.
* Conducted **static and dynamic code reviews**, integrated SAST/DAST tools, and improved application resilience.
* Delivered actionable **threat models, risk matrices, and remediation plans**.

### **2. DevSecOps Engineer**

* Designed and automated a **security-integrated CI/CD pipeline** on **GitLab**.
* Integrated **Semgrep**, **Snyk**, **Trivy**, and **GitLeaks** for automated code, dependency, container, and secret scanning.
* Applied **Shift-Left Security** principles to embed continuous scanning at every stage of SDLC.
* Managed **cloud deployment via AWS ECS** with private registries, secure IAM policies, and monitoring (CloudWatch).

### **3. Cloud Security Engineer**

* Hardened AWS deployment using **ECR private registries, least-privilege IAM**, and **VPC security groups**.
* Ensured secure inter-service communication and encrypted storage using **S3 + IAM policies**.
  

### **4. Secure SDLC / AppSec Program Contributor**

* Implemented a **secure SDLC lifecycle**:

  > Design → Threat Modeling → Risk Assessment → Secure Coding → CI/CD Scanning → Secure Deployment → Monitoring
* Ensured each stage integrated feedback and verification loops for continuous improvement.

---

# 📚 Week-by-Week Technical Summary

## **Week 1 — Building a Vulnerable Application**

**Goal:** Develop an intentionally vulnerable Node.js API to understand how security flaws arise and are exploited.

### Vulnerabilities Simulated

* **Input Validation Failure** → NoSQLi & XSS.
* **Sensitive Data Disclosure** → Secrets in repo (.env, credentials).
* **Error Leakage** → Stack traces revealing backend logic.
* **IDOR (Broken Access Control)** → Direct user data manipulation.
* **Weak JWT Secret / Hardcoded Credentials.**
* **Plaintext Passwords** and missing password policy.
* **No Rate Limiting / Authentication Controls.**

### Learning Outcome

Built the foundation for AppSec understanding — identifying how **developer errors translate into exploitable attack vectors**.
Mapped vulnerabilities to **OWASP Top 10 / API Security Top 10** and validated mitigation techniques (input validation, secret management, error handling, rate limiting).

---

## **Week 2 — Authentication, RBAC, and Access Control**

**Goal:** Implement and exploit Role-Based Access Control, JWT management, and authorization flaws.

### Key Findings

* Weak JWT secret enabled **token forgery** → privilege escalation.
* IDOR allowed users to access other users’ records.
* Missing authorization checks enabled **admin-level destructive operations**.
* Excessive data exposure returned full user objects.

### Mapped OWASP Categories

* Broken Access Control (A01/API1)
* Broken Authentication (A02/API2)
* Excessive Data Exposure (A03)
* Security Misconfiguration (A05)

### Business Impact

* Unauthorized data access and account takeover.
* Potential **GDPR/PII violation**, regulatory fines, and brand damage.

### Remediation & Controls

* Strong random JWT secrets via environment variables.
* Middleware enforcing **`requireOwnerOrAdmin`** authorization pattern.
* Short-lived access tokens with refresh tokens.
* Secret scanning and CI enforcement.
* Audit logging and anomaly detection for admin endpoints.

---

## **Week 3 — Threat Modeling**

**Goal:** Create a full threat model using **OWASP Threat Dragon** and **STRIDE** to identify critical risks.

### Critical Threats Identified

| Threat                     | STRIDE Category                   | Severity |
| -------------------------- | --------------------------------- | -------- |
| JWT Secret Exposure        | Spoofing / Elevation of Privilege | Critical |
| Insecure MongoDB Config    | Tampering / Info Disclosure       | High     |
| Plaintext Password Storage | Info Disclosure                   | Critical |
| Lack of TLS / HTTPS        | Spoofing                          | High     |
| No Rate Limiting           | DoS                               | High     |

### Mitigation Plan

* Implement secret rotation and vault management.
* Secure DB binding and enforce authentication.
* TLS enforcement + HSTS headers.
* Rate limiting and CAPTCHA on login.
* Harden IAM & deploy runtime monitoring.

**Result:** Produced actionable **threat model diagrams**, mitigation strategies, and detection controls — replicating the process used by AppSec engineers in design reviews.

---

## **Week 3 (continued) — Risk Analysis**

**Goal:** Quantify risk using **Likelihood × Impact matrix**.

### Critical Risks

* Hard-coded JWT secret → Critical (Privilege Escalation).
* Broken Access Control → Critical (Data Exfiltration).
* Plaintext Passwords → Critical (Credential Theft).
* No TLS / Rate Limiting → High.
* Exposed MongoDB → High.

### Risk Treatment

1. Remove secrets from code, enforce secret scanning (GitLeaks).
2. Secure password storage (bcrypt/argon2).
3. Enforce HTTPS only.
4. Apply express-rate-limit middleware.
5. Harden database and logging configurations.

### Outcome

Delivered a **Risk Register & Mitigation Plan**, ready for executive consumption — a skill aligned with **AppSec Governance and Security Architecture roles**.

---

## **Week 4 — DevSecOps CI/CD Security Pipeline**

**Goal:** Automate security scanning throughout the pipeline.

### Pipeline Stages & Tools

| Stage                  | Tool                          | Function                                   |
| ---------------------- | ----------------------------- | ------------------------------------------ |
| **SAST**               | Semgrep                       | Detect insecure coding patterns            |
| **SCA**                | Snyk + GitLab Dependency Scan | Detect vulnerable dependencies             |
| **Secret Scanning**    | GitLeaks                      | Detect leaked keys & credentials           |
| **Container Scanning** | Trivy                         | Identify OS and base-image vulnerabilities |
| **DAST**               | OWASP ZAP + GitLab DAST       | Runtime vulnerability detection            |

### Key DevSecOps Practices

* **Shift-Left Security:** Security integrated from commit to deployment.
* **Automated Vulnerability Reporting:** JSON artifacts and GitLab dashboards.
* **False Positive Handling:** Baselining, MR review, and rule tuning.
* **Continuous Security Feedback:** Developers receive real-time vulnerability insight.

**Impact:** Achieved **end-to-end CI/CD visibility** and continuous vulnerability assessment in line with **modern AppSec pipelines**.

---

## **Week 5 — AWS Cloud Deployment**

**Goal:** Securely deploy the vulnerable API to **AWS ECS using Docker containers** with robust IAM and network controls.

### Implementation Steps

1. **IAM Setup** — created users, groups, and roles following **least-privilege principle**.
2. **Dockerization** — containerized app for reproducibility.
3. **ECR (Private Registry)** — pushed and managed secure images.
4. **ECS (Fargate)** — deployed serverless containers with defined task roles.
5. **VPC Security Groups** — limited port exposure and segmented app/database layers.
6. **S3 Storage** — configured image storage with IAM policy enforcement.
7. **CloudWatch Logging** — enabled monitoring, log retention, and alerting.

### Cloud Security Principles Practiced

* **Least Privilege & Access Control**
* **Defense-in-Depth via VPC segmentation**
* **Secure Configuration Management**
* **Continuous Monitoring and Auditing**

### Result

Delivered a working **secure cloud deployment workflow** mirroring enterprise DevSecOps practices, integrating **AppSec + Cloud Security** disciplines.

---

# 🧩 Integrated Outcome — From Vulnerability to Secure Cloud Pipeline

| Phase        | Domain                 | Tools / Techniques                 | Outcome                                |
| ------------ | ---------------------- | ---------------------------------- | -------------------------------------- |
| **Week 1-2** | AppSec, Secure Coding  | Node.js, OWASP Top 10, RBAC        | Vulnerability discovery & mitigation   |
| **Week 3**   | Threat Modeling & Risk | STRIDE, Threat Dragon              | Comprehensive threat and risk analysis |
| **Week 4**   | DevSecOps Pipeline     | GitLab CI/CD, Semgrep, Snyk, Trivy | Automated SDLC security                |
| **Week 5**   | Cloud Security         | AWS ECR/ECS, IAM, S3, CloudWatch   | Secure containerized cloud deployment  |

---

# 🧩 Technical Skills Demonstrated

| Category                         | Tools / Frameworks                               | Competencies                                   |
| -------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| **Programming & API Security**   | Node.js, Express, MongoDB                        | Input validation, RBAC, JWT, encryption        |
| **Application Security Testing** | OWASP ZAP, Postman                               | Manual exploit testing, fuzzing, recon         |
| **DevSecOps Automation**         | GitLab CI/CD, Semgrep, Trivy, GitLeaks, Snyk     | Pipeline automation, vulnerability scanning    |
| **Threat Modeling & Risk**       | STRIDE, OWASP Threat Dragon                      | Threat identification, impact scoring          |
| **Cloud & Container Security**   | Docker, AWS ECR/ECS/S3/IAM                       | Secure deployment, least privilege, monitoring |
| **Security Governance**          | OWASP Top 10, NIST SP 800-53, ISO 27001 Concepts | Risk treatment, secure SDLC alignment          |

---

# 🏆 Demonstrated AppSec Role Readiness

### ✔️ Application Security Engineer

* Performs secure code review and automated static analysis.
* Builds and enforces RBAC, token management, and input validation.
* Conducts vulnerability triage and provides developer-ready remediation guidance.

### ✔️ DevSecOps Engineer

* Builds pipelines integrating SAST, SCA, DAST, and secret scanning.
* Embeds shift-left culture through CI/CD security automation.
* Applies container security and continuous compliance monitoring.

### ✔️ Cloud Security / Security Operations Engineer

* Manages cloud identity and access policies.
* Implements secure networking and monitoring for workloads.
* Enforces encryption, logging, and defense-in-depth configurations.

### ✔️ Secure SDLC / Threat Modeling Specialist

* Leads threat modeling exercises for APIs and microservices.
* Conducts structured risk assessments and creates mitigation roadmaps.
* Establishes security baselines aligned with OWASP & CIS Benchmarks.

---

# 🧠 Final Reflection

This DevSecOps/AppSec project mirrors the **full lifecycle of modern application security engineering** — from identifying vulnerabilities in development to securing deployments in the cloud.

By combining **hands-on exploitation, remediation, automation, and cloud security**, the project demonstrates readiness for roles requiring practical expertise in **Application Security**, **DevSecOps**, and **Cloud Security Engineering**.

It showcases not only technical mastery but also strategic understanding of **how to integrate security seamlessly into development pipelines** — turning reactive security into proactive, automated defense.

---


