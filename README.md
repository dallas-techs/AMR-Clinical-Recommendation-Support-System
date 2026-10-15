# AI-Powered Clinical Recommendation Support System for Early Detection and Management of Antimicrobial Resistance (AMR)

An AI-powered clinical decision-support application designed to assist healthcare professionals in assessing antimicrobial resistance (AMR) risk, understanding prediction factors, and reviewing evidence-informed clinical recommendations.

## Overview

Antimicrobial resistance is a major public health challenge that can make infections more difficult to treat. This project combines machine learning, explainable AI, clinical data management, and reporting capabilities to support healthcare professionals in reviewing patient-specific AMR risk.

The system is designed as a **clinical recommendation support tool, not an autonomous diagnostic or prescribing system**. Healthcare professionals retain responsibility for interpreting results and making final clinical decisions.

## Key Features

- **Secure Authentication:** Doctor login, registration, JWT authentication, and protected routes.
- **Dashboard:** Overview of patient records and clinical activity.
- **Patient Management:** Create, view, update, and delete patient records.
- **Clinical Records:** Store and manage relevant patient clinical information.
- **AMR Risk Prediction:** Machine-learning-based AMR risk assessment using clinical and laboratory features.
- **Explainable AI:** SHAP-based explanations to help interpret important prediction factors.
- **Clinical Recommendation Support:** Evidence-informed suggestions to support antimicrobial stewardship and further clinical assessment.
- **Prediction History:** Review previously recorded AMR predictions.
- **Doctor Verification:** Support doctor review and verification of reports.
- **PDF Reports:** Generate structured clinical reports for review and documentation.
- **Trend Analysis:** Dashboard-based views of available clinical and prediction data.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios, Material UI |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| Machine Learning | Scikit-learn, Random Forest |
| Explainable AI | SHAP |
| Authentication | JWT, bcrypt |
| ORM | SQLAlchemy |
| PDF Generation | ReportLab |
| Development Tools | Visual Studio Code, Git, GitHub |

## System Architecture

1. **Frontend:** Provides the interface for doctors to manage patients, enter clinical information, review predictions, and access reports.
2. **Backend API:** FastAPI handles authentication, patient management, clinical records, prediction requests, recommendations, and reporting.
3. **Database:** PostgreSQL stores application records and related clinical information.
4. **Machine Learning:** The trained model processes supported clinical and laboratory features to estimate AMR risk.
5. **Explainability:** SHAP helps present factors influencing the model's predictions.
6. **Reporting:** ReportLab generates structured PDF reports for clinical review and documentation.

## Application Workflow

1. Doctor logs in securely.
2. Patient details are created or retrieved.
3. Relevant clinical and laboratory information is entered.
4. The system generates an AMR risk prediction.
5. Explainability results help the doctor review important contributing factors.
6. Clinical recommendation support is displayed.
7. The doctor reviews and verifies the report when appropriate.
8. A PDF report can be generated for documentation.

## Project Structure

```text
AMR/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── ml/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
│   └── package.json
├── dataset/
├── docs/
├── assets/
└── README.md
```

*This is a high-level structure; actual folders and files may vary by project version.*

## Prerequisites

Install the following before running the application:

- Python 3.11 or a compatible version
- Node.js and npm
- PostgreSQL
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dallas-techs/AMR-Clinical-Recommendation-Support-System.git
cd AMR-Clinical-Recommendation-Support-System
```

### 2. Configure the Backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Configure the PostgreSQL connection and other required environment variables using your local environment configuration. Never commit passwords, JWT secrets, or database credentials to GitHub.

### 3. Configure the Database

- Create a PostgreSQL database for the application.
- Configure the database connection using the project's expected environment variable names.
- Ensure the required tables and database schema are initialized using the project's existing setup instructions.

### 4. Start the Backend

From the `backend` directory, run:

```bash
python -m uvicorn app.main:app --reload
```

The API documentation is typically available at:

`http://127.0.0.1:8000/docs`

### 5. Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in the terminal.

*The backend and frontend startup instructions assume the current project structure and configuration are retained.*

## Machine Learning and Explainability

The project uses a trained machine-learning model to estimate AMR risk from supported clinical and laboratory features. Random Forest is the configured model approach, while SHAP is used to explain relevant prediction factors.

Model performance should be assessed using suitable metrics such as precision, recall, F1-score, ROC-AUC, and a confusion matrix. Results should be reported only from actual model evaluation experiments.

## Clinical Safety and Limitations

- Predictions are decision-support outputs and must not be treated as definitive diagnoses.
- Recommendations are intended to support clinical review and antimicrobial stewardship; the system does not independently prescribe antibiotics.
- Model performance depends on the quality, representativeness, and completeness of the underlying data.
- Outputs require interpretation by qualified healthcare professionals.
- Patient information must be handled securely and in accordance with applicable privacy requirements.

## Future Enhancements

- Integration with additional clinical decision-support modules.
- Improved validation using larger and more representative datasets.
- Enhanced monitoring of AMR risk trends.
- Further refinement of explainability and clinical reporting.
- Secure integration with compatible healthcare information systems.

## Disclaimer

This project is intended for academic research and clinical decision-support development. It is not a substitute for professional medical judgment, microbiological testing, or established clinical guidelines. All clinical decisions remain the responsibility of qualified healthcare professionals.

## Author

**Dallas**

Final-Year B.Tech — Computer Science and Engineering (AI Specialization)

## Repository

[GitHub — AMR Clinical Recommendation Support System](https://github.com/dallas-techs/AMR-Clinical-Recommendation-Support-System)
