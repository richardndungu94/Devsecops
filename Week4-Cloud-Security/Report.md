# Deploying a Vulnerable Authentication API on AWS

## Overview
This week’s task was to deploy a **vulnerable authentication API** to the **AWS Cloud** 

The week's task aimed to demonstrate how to:
- containerize an application.
- securely push it to the cloud.
- manage it using AWS services while applying **security best practices** like the **principle of least privilege**.
 

---

## Week's Goals
- Deploy the vulnerable  API to AWS.
- Learn to work with AWS ECR and ECS for secure container management.
- Practice IAM configuration and least privilege principles.
- Implement secure networking between containers and databases.
- Develop confidence in cloud-based DevSecOps workflows.

---

## Stages

### **1. Identity and Access Management (IAM) Setup**
The first step was creating a secure identity structure using AWS IAM.  
I set up a **dedicated IAM group** and **user** with limited permissions tailored only to the tasks needed — specifically, managing ECR repositories and ECS clusters.  
By avoiding root access and unnecessary administrative permissions, 
I ensured the project adhered to the **principle of least privilege**.  
This stage enhanced my understanding of secure policy creation, access keys management, and user-group role assignments in AWS.

---

### **2. Dockerization of the Application**
The vulnerable authentication API was containerized using **Docker**, which allowed it to run consistently across environments.  
This stage involved defining the application dependencies, exposed ports, and build environment.  
Containerization ensured portability and simplified deployment both locally and in the cloud.  


---

### **3. Creating a Secure AWS ECR Repository**
Next, I created a **private Elastic Container Registry (ECR)** to store the container images securely in AWS.  
This repository served as the central storage for the built Docker image, ensuring version control and restricted access.  
By using a private ECR, I ensured that only authenticated AWS users and services could pull or push images, reducing exposure to unauthorized access.

---

### **4. Local Testing and Container Networking**
Before moving to the cloud, I tested the container locally using Docker networks.  
A local MongoDB container was created and linked to the application through an isolated virtual network.  
This process helped validate that the containers could communicate securely without exposing unnecessary ports to the public.  
The local test stage reinforced the importance of **network segmentation** and **secure container communication**.

---

### **5. ECS Cluster Creation and Deployment**
After verifying local functionality, I moved to the cloud by setting up an **Amazon ECS Cluster**.  
Within the cluster, I defined **task definitions** and **services** that specified how the application containers should run, their resource limits, and which image to use from ECR.  
Using AWS Fargate simplified deployment by removing the need to manage EC2 instances directly, providing a **serverless container environment** that enhances scalability and reduces the attack surface.

---

### **6. Networking and Security Groups**
A crucial part of deployment involved configuring **networking and security groups**.  
I ensured that only the required ports were exposed — specifically, port 3000 for the API and port 27017 for MongoDB.  
Access was restricted to internal services and specific IP ranges, following the **defense-in-depth** security principle.  
This stage strengthened my understanding of VPC subnets, inbound and outbound rules, and the importance of tightly controlled access boundaries.

---

### **7. Monitoring and Logs**
Once the containers were running in ECS, I verified their operation through **AWS CloudWatch** and **container logs**.  
This provided visibility into application performance and potential runtime issues.  
Continuous monitoring highlighted the importance of maintaining observability in any secure cloud environment.

---

## Week's Security Concepts Practiced
| Security Concept | Application in Project |
|------------------|------------------------|
| **Least Privilege** | Assigned IAM roles and policies with minimal required permissions |
| **Defense in Depth** | Used network segmentation and restricted security group rules |
| **Secure Access Control** | Managed access via IAM users and private ECR authentication |
| **Container Isolation** | Used separate containers for the app and database |
| **Auditing & Monitoring** | Monitored activity via CloudWatch and ECS event logs |

---

## Lessons Learned
- AWS IAM and policy management are essential to cloud security — small misconfigurations can expose resources.
- Docker provides excellent consistency between local and cloud environments.
- Private repositories like AWS ECR significantly improve image security.
- Proper network configuration is key to minimizing attack surfaces.
- CloudWatch and logging systems are vital for maintaining visibility and accountability.

---

##  Tools and Services Used
- **AWS IAM** – Identity and access management for secure user and policy configuration.  
- **AWS ECR** – Private container registry for storing Docker images.  
- **AWS ECS (Fargate)** – Serverless container orchestration platform.  
- **Docker** – Used for containerizing and testing the application locally.  
- **MongoDB** – Database used by the vulnerable authentication API.  
- **CloudWatch** – For monitoring and collecting container logs.

---

## Conclusion
This week’s project provided hands-on experience in securely deploying a containerized application to AWS.  
I learned how to balance functionality with security through careful IAM setup, container isolation, and network configuration.  
The project not only reinforced technical cloud deployment skills but also built a strong foundation in **AWS security practices** — an essential part of any modern DevSecOps workflow.

---

## Apendix Images
