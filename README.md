# Full-Stack Serverless Task Tracker 🚀

This is a complete full-stack, serverless web application for tracking tasks. It features a modern React frontend, a Python-based serverless backend running on AWS Lambda, and a fully automated CI/CD pipeline for seamless deployments.

### ✨ [Live Demo Link](https://d1z7sy4b6kmbg7.cloudfront.net/) ✨


---

## 📸 Screenshot

<img width="1920" height="936" alt="2025-10-28 04 08 55" src="https://github.com/user-attachments/assets/1f626dee-75fa-40eb-8fa4-419e09753794" />



---

## 🎯 Features

* **Create, Read, Update, Delete (CRUD) Tasks:** A simple and intuitive interface to manage your daily tasks.
* **Modern UI:** A clean and responsive user interface built with React and styled with Tailwind CSS.
* **Serverless Backend:** No servers to manage. The backend scales automatically and you only pay for what you use.
* **Fully Automated Deployment:** Pushing a change to the `main` branch on GitHub automatically builds and deploys the updates to the live application.

---

## 🏛️ Architecture

This project is built using a 100% serverless architecture on AWS, emphasizing a separation of concerns between the frontend, backend, and the automation pipeline.



* **Frontend:**
    * **Amazon S3:** Hosts the static React application files (HTML, CSS, JS).
    * **Amazon CloudFront:** Acts as the Content Delivery Network (CDN) to provide a secure `https://` URL, cache content globally, and accelerate website delivery.

* **Backend:**
    * **Amazon API Gateway:** Provides the public REST API endpoints (`/tasks`, `/tasks/{id}`).
    * **AWS Lambda:** Runs the Python backend code for each API endpoint (Create, Get, Update, Delete).
    * **Amazon DynamoDB:** A fully managed NoSQL database used to store the tasks.
    * **IAM:** Manages permissions to ensure the Lambda functions can securely access the DynamoDB table.

* **CI/CD Automation:**
    * **GitHub:** The source code repository.
    * **AWS CodePipeline:** Orchestrates the entire build and deploy process.
    * **AWS CodeBuild:** Compiles the React frontend and packages the serverless backend application.
    * **AWS CloudFormation (via SAM):** Deploys the entire backend stack (API, Lambdas, IAM Role, DynamoDB table) from a single template file.

---

## 💻 Technology Stack

| Frontend              | Backend                          |
| --------------------- | -------------------------------- |
| React.js              | Python 3.13                      |
| TypeScript            | AWS Lambda                       |
| Vite                  | AWS SDK (Boto3)                  |
| Tailwind CSS          | Serverless Application Model (SAM) |
|                       | Amazon DynamoDB                  |
|                       | Amazon API Gateway               |

---

## ⚙️ The CI/CD Pipeline

This project features two distinct, parallel pipelines that are both triggered by a `git push` to the `main` branch.

1.  **Frontend Pipeline (`task-tracker-frontend-pipeline`):**
    * **Source:** Detects a change in the `/frontend` directory.
    * **Build:** Runs `npm install` and `npm run build` inside a CodeBuild environment to compile the React app.
    * **Deploy:** Copies the contents of the `frontend/dist` folder to the S3 bucket, automatically invalidating the CloudFront cache to serve the latest version.

2.  **Backend Pipeline (`task-tracker-backend-pipeline`):**
    * **Source:** Detects a change in the `/backend` directory or the root `template.yaml`.
    * **Build:** Uses the SAM CLI (`sam build`) to package the Python Lambda functions.
    * **Deploy:** Uses AWS CloudFormation to deploy the packaged application, updating the API and Lambda functions seamlessly.
