from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ============================================================
# DATABASE
# ============================================================

from app.database import Base, engine


# ============================================================
# IMPORT ALL MODELS
# IMPORTANT:
# All models must be imported BEFORE create_all()
# so SQLAlchemy knows about every table.
# ============================================================

from app.models.user import User
from app.models.patient import Patient
from app.models.patient_counter import PatientCounter
from app.models.clinical_record import ClinicalRecord
from app.models.prediction import Prediction
from app.models.recommendation import Recommendation
from app.models.doctor_verification import DoctorVerification


# ============================================================
# IMPORT ROUTERS
# ============================================================
from app.routers import (
    auth,
    patient,
    clinical_record,
    prediction,
    explain,
    recommendation,
    dashboard,
    report_router,
    verification,
    doctor_verification
)


# ============================================================
# CREATE ONLY MISSING TABLES
#
# Existing tables and existing data will NOT be deleted.
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AMR Clinical Recommendation Support System",
    description=(
        "AI-Powered Clinical Recommendation Support System "
        "for Early Detection and Management of Antimicrobial Resistance"
    ),
    version="1.0.0"
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# AUTHENTICATION ROUTER
# ============================================================

app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)


# ============================================================
# PATIENT ROUTER
# ============================================================

app.include_router(
    patient.router,
    prefix="/patients",
    tags=["Patients"]
)


# ============================================================
# CLINICAL RECORD ROUTER
# ============================================================

app.include_router(
    clinical_record.router,
    prefix="/clinical-records",
    tags=["Clinical Records"]
)


# ============================================================
# AI PREDICTION ROUTER
# ============================================================

app.include_router(
    prediction.router,
    prefix="/predict",
    tags=["AI Prediction"]
)


# ============================================================
# AI EXPLAINABILITY ROUTER
# ============================================================

app.include_router(
    explain.router,
    prefix="/explain",
    tags=["AI Explainability"]
)


# ============================================================
# CLINICAL RECOMMENDATION ROUTER
# ============================================================

app.include_router(
    recommendation.router,
    prefix="/recommend",
    tags=["Clinical Recommendation"]
)


# ============================================================
# DASHBOARD ROUTER
# ============================================================

app.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["Dashboard"]
)


# ============================================================
# REPORT GENERATION ROUTER
# ============================================================

app.include_router(
    report_router.router
)


# ============================================================
# REPORT VERIFICATION ROUTER
# ============================================================

app.include_router(
    verification.router,
    prefix="/verification",
    tags=["Report Verification"]
)


# ============================================================
# DOCTOR VERIFICATION ROUTER
# ============================================================

app.include_router(
    doctor_verification.router,
    prefix="/doctor-verification",
    tags=["Doctor Verification"]
)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Welcome to AMR Clinical Recommendation Support System",
        "status": "Backend Running Successfully"
    }

# ============================================================
# HEALTH CHECK ENDPOINT
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "Healthy",
        "api": "Running"
    }