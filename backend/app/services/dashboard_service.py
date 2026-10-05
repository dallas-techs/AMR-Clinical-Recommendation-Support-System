from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_, desc

from app.models.patient import Patient
from app.models.clinical_record import ClinicalRecord
from app.models.prediction import Prediction
from app.models.recommendation import Recommendation
from app.models.doctor_verification import DoctorVerification


# ============================================================
# HARDCODED MODEL PERFORMANCE
# (from ml/evaluation/model_evaluation_results.csv)
# ============================================================

RANDOM_FOREST_PERFORMANCE = {
    "model_name": "Random Forest v1.0",
    "accuracy": 96.36,
    "precision": 71.43,
    "recall": 100.0,
    "f1_score": 83.33,
    "roc_auc": 98.60,
}


def get_dashboard_data(db: Session):

    # --------------------------------------------------------
    # KPI Counts
    # --------------------------------------------------------

    total_patients = db.query(Patient).count()
    clinical_records = db.query(ClinicalRecord).count()
    total_predictions = db.query(Prediction).count()
    verified_reports = db.query(DoctorVerification).count()

    high_risk_cases = (
        db.query(Prediction)
        .filter(Prediction.prediction == "High AMR Risk")
        .count()
    )

    low_risk_cases = (
        db.query(Prediction)
        .filter(Prediction.prediction == "Low AMR Risk")
        .count()
    )

    average_risk_score = (
        db.query(func.avg(Prediction.risk_score)).scalar()
    )

    if average_risk_score is None:
        average_risk_score = 0.0

    # --------------------------------------------------------
    # Pending Verifications
    # Count predictions that don't have a matching verification
    # --------------------------------------------------------

    verified_prediction_ids = db.query(
        DoctorVerification.prediction_id
    ).subquery()

    pending_verifications = (
        db.query(Prediction)
        .filter(
            Prediction.id.notin_(verified_prediction_ids)
        )
        .count()
    )

    # --------------------------------------------------------
    # Top 5 High Risk Patients
    # Latest prediction per patient, highest risk first
    # Using a subquery to get the latest prediction per patient
    # --------------------------------------------------------

    latest_pred_subquery = (
        db.query(
            Prediction.patient_id,
            func.max(Prediction.id).label("max_id")
        )
        .group_by(Prediction.patient_id)
        .subquery()
    )

    top_risk_rows = (
        db.query(Prediction, Patient)
        .join(
            latest_pred_subquery,
            and_(
                Prediction.patient_id == latest_pred_subquery.c.patient_id,
                Prediction.id == latest_pred_subquery.c.max_id
            )
        )
        .join(Patient, Patient.id == Prediction.patient_id)
        .filter(Prediction.prediction == "High AMR Risk")
        .order_by(desc(Prediction.risk_score))
        .limit(5)
        .all()
    )

    top_risk_patients = []
    for pred, patient in top_risk_rows:
        top_risk_patients.append({
            "patient_id": patient.id,
            "patient_name": patient.full_name,
            "patient_code": patient.patient_id,
            "risk_score": round(pred.risk_score, 2),
            "risk_level": pred.risk_level,
            "prediction": pred.prediction,
            "predicted_at": pred.created_at,
        })

    # --------------------------------------------------------
    # Recent Activity — batch fetch with joins (no N+1)
    # --------------------------------------------------------

    activities = []

    # Recent Patients
    recent_patients = (
        db.query(Patient)
        .order_by(Patient.created_at.desc())
        .limit(5)
        .all()
    )

    for patient in recent_patients:
        activities.append({
            "activity": "Patient added",
            "patient_id": patient.id,
            "patient_name": patient.full_name,
            "created_at": patient.created_at
        })

    # Recent Clinical Records with patient join
    recent_clinical_records = (
        db.query(ClinicalRecord, Patient)
        .join(Patient, Patient.id == ClinicalRecord.patient_id)
        .order_by(ClinicalRecord.created_at.desc())
        .limit(5)
        .all()
    )

    for record, patient in recent_clinical_records:
        activities.append({
            "activity": "Clinical record created",
            "patient_id": patient.id,
            "patient_name": patient.full_name,
            "created_at": record.created_at
        })

    # Recent Predictions with patient join
    recent_predictions = (
        db.query(Prediction, Patient)
        .join(Patient, Patient.id == Prediction.patient_id)
        .order_by(Prediction.created_at.desc())
        .limit(5)
        .all()
    )

    for prediction, patient in recent_predictions:
        activities.append({
            "activity": "AMR prediction generated",
            "patient_id": patient.id,
            "patient_name": patient.full_name,
            "created_at": prediction.created_at
        })

    # Recent Doctor Verifications with patient join
    recent_verifications = (
        db.query(DoctorVerification, Patient)
        .join(Patient, Patient.id == DoctorVerification.patient_id)
        .order_by(DoctorVerification.verified_at.desc())
        .limit(5)
        .all()
    )

    for verification, patient in recent_verifications:
        activities.append({
            "activity": "Clinical report verified",
            "patient_id": patient.id,
            "patient_name": patient.full_name,
            "created_at": verification.verified_at
        })

    # Sort all activities by latest timestamp
    activities.sort(
        key=lambda item: item["created_at"],
        reverse=True
    )

    # Keep only the latest 8 activities
    activities = activities[:8]

    return {
        "total_patients": total_patients,
        "clinical_records": clinical_records,
        "total_predictions": total_predictions,
        "verified_reports": verified_reports,
        "high_risk_cases": high_risk_cases,
        "low_risk_cases": low_risk_cases,
        "average_risk_score": round(float(average_risk_score), 2),
        "recent_activity": activities,
        "top_risk_patients": top_risk_patients,
        "model_performance": RANDOM_FOREST_PERFORMANCE,
        "pending_verifications": pending_verifications,
    }