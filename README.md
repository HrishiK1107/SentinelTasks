# 🛡️ SentinelTasks  
### Full-Stack Serverless Task Tracker with Automated CI/CD

This project is a complete full-stack, serverless web application that demonstrates **advanced security**, **full automation**, and modern cloud architecture on AWS.


## 📸 Screenshot

<img width="1920" height="936" alt="2025-10-28 04 08 55" src="https://github.com/user-attachments/assets/1f626dee-75fa-40eb-8fa4-419e09753794" />

---

## 🎯 Key Features & Security Enhancements

* **Access Control (10/10 Security):** Implemented **Amazon Cognito** to manage user sign-in/sign-up. **API Gateway** is configured to reject any request to create, update, or delete tasks without a valid **JWT (JSON Web Token)**.
* **Full CRUD Operations:** A modern interface for creating, reading, updating, and deleting tasks.
* **Modern UI:** Built with **React** and styled with **Tailwind CSS**.
* **100% Serverless Backend:** Scalable and cost-effective architecture using only managed services.
* **Fully Automated Deployment:** Pushing to the `main` branch automatically deploys both the frontend and backend with zero downtime.

---

## 🏛️ Architecture

This project uses a decoupled, secure serverless design built entirely on AWS.

| Layer | Services Used | Purpose |
| :--- | :--- | :--- |
| **Identity & Access** | **Amazon Cognito**, IAM | **Manages all user authentication and token issuance.** IAM roles manage service-to-service permissions. |
| **Networking/CDN** | Amazon CloudFront, S3 | Global content delivery, **SSL encryption (`HTTPS`)**, and hosting of static frontend assets. |
| **API/Compute** | **API Gateway, AWS Lambda (Python)** | Public REST API secured by the **Cognito Authorizer** to validate JWTs before invoking Python Lambda functions. |
| **Data** | Amazon DynamoDB | Scalable, fully managed NoSQL data storage. |
| **CI/CD** | **CodePipeline, CodeBuild, SAM** | Automated build and deployment using **Infrastructure as Code (IaC)**. |

---

## 🔑 Key Deployment Skills Demonstrated

* **Security Integration:** Implemented the industry-standard method for securing a REST API using a **Cognito User Pool Authorizer**.
* **DevOps Mastery:** Built and debugged two parallel **CodePipeline** workflows.
* **Infrastructure as Code (IaC):** Defined the entire backend, including security, using a single **SAM/CloudFormation** template.
* **Full-Stack Development:** Integrated a **React (TypeScript) frontend** with a **Python (Boto3) backend** for full data flow.

---
## ⚙️ CI/CD Pipeline Overview

Two parallel pipelines are triggered automatically on every push to the `main` branch.

### Frontend Pipeline  
**Pipeline Name:** `task-tracker-frontend-pipeline`

1. Detects changes in the `/frontend` directory  
2. Runs `npm install` and `npm run build` in CodeBuild  
3. Uploads build artifacts to Amazon S3  
4. Invalidates CloudFront cache automatically

### Backend Pipeline  
**Pipeline Name:** `task-tracker-backend-pipeline`

1. Detects changes in `/backend` or `template.yaml`  
2. Packages Lambda functions using `sam build`  
3. Deploys infrastructure using CloudFormation  
4. Updates API Gateway, Lambda functions, IAM roles, and DynamoDB

---

## 📁 Repository Structure

- `frontend/` – React + Tailwind frontend  
- `backend/` – Python AWS Lambda functions  
- `template.yaml` – AWS SAM / CloudFormation template  
- `README.md` – Project documentation

---

## 📌 Summary

SentinelTasks demonstrates the design and deployment of a modern serverless application using AWS managed services.  
It highlights practical experience with cloud architecture, CI/CD automation, and production-grade deployments.

--- 
