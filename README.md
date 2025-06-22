# Budget Wise
**Online personal budget management**

Budget Wise is a web application designed to help users take control of their finances by tracking income, expenses, and savings goals. It features:

- **Secure authentication** with account creation and login
- **Dashboard overview** showing current balance, spending categories, and monthly summaries
- **Add, edit, delete** transactions with category tags for better organization
- **Reporting tools** to visualize spending habits and identify saving opportunities
- **Responsive UI** so you can manage your budget from mobile or desktop

Budget Wise helps users take control of their finances with a full-stack monorepo setup:

- **backend/** – built with **Java** and **Gradle**
- **frontend/** – built with **React** and **Vite**

---

# Sonar Report

A quick glance at our SonarCloud quality gate status for both backend and frontend:

| Component | Quality Gate Status |
|----------|----------------------|
| backend  | [![backend Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=org-backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=org-backend) |
| frontend | [![frontend Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=org-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=org-frontend) |

---

## 🛠 Setup

After cloning the repository: From the repository root, follow these steps

```bash

### 1. Install pre-commit hooks in local 

npm install


### 2. Backend

```bash
cd backend
./gradlew clean build

### 3. Frontend

```bash
cd backend
./gradlew clean build

### 3. Run backend locally

cd backend
./gradlew bootRun

### 3. Run frontend locally

cd frontend
npm run dev


### 📝 Notes

- The **Sonar badge table** gives a clear overview of code quality.
- Structure is optimized for **Gradle multi-project build** and **npm/Vite frontend**.
- Setup/instructions are clearly separated for backend and frontend.