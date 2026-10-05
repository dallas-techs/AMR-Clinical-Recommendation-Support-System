from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime

from app.models.patient import Patient
from app.models.clinical_record import ClinicalRecord
from app.models.prediction import Prediction
from app.models.recommendation import Recommendation
from app.models.doctor_verification import DoctorVerification

from app.schemas.explain import ExplainRequest
from app.services.explain_service import explain_prediction

from app.services.pdf_template import generate_pdf


def generate_report_id():
    return "AMR-" + datetime.now().strftime("%Y%m%d-%H%M%S")


def get_patient(db: Session, patient_id: int):

    return (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )


def get_clinical_record(db: Session, patient_id: int):

    return (
        db.query(ClinicalRecord)
        .filter(ClinicalRecord.patient_id == patient_id)
        .order_by(ClinicalRecord.id.desc())
        .first()
    )


def get_prediction(db: Session, patient_id: int):

    return (
        db.query(Prediction)
        .filter(Prediction.patient_id == patient_id)
        .order_by(Prediction.id.desc())
        .first()
    )


def get_recommendation(db: Session, prediction_id: int):

    return (
        db.query(Recommendation)
        .filter(Recommendation.prediction_id == prediction_id)
        .order_by(Recommendation.id.desc())
        .first()
    )


def get_doctor_verification(
    db: Session,
    patient_id: int,
    prediction_id: int
):

    return (
        db.query(DoctorVerification)
        .filter(
            DoctorVerification.patient_id == patient_id,
            DoctorVerification.prediction_id == prediction_id
        )
        .order_by(DoctorVerification.id.desc())
        .first()
    )


def generate_report(db: Session, patient_id: int):

    # ---------------------------------------------------------
    # 1. Get Patient
    # ---------------------------------------------------------

    patient = get_patient(db, patient_id)

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    # ---------------------------------------------------------
    # 2. Get Latest Clinical Record
    # ---------------------------------------------------------

    clinical = get_clinical_record(db, patient_id)

    if clinical is None:
        raise HTTPException(
            status_code=404,
            detail="Clinical record not found"
        )

    # ---------------------------------------------------------
    # 3. Get Latest Prediction
    # ---------------------------------------------------------

    prediction = get_prediction(db, patient_id)

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    # ---------------------------------------------------------
    # 4. Check Stored Prediction Features
    # ---------------------------------------------------------

    if not prediction.input_features:

        raise HTTPException(
            status_code=400,
            detail=(
                "Prediction input features are not available. "
                "Generate a new prediction before creating the report."
            )
        )

    features = prediction.input_features

    # ---------------------------------------------------------
    # 5. Check Doctor Verification
    # ---------------------------------------------------------

    doctor_verification = get_doctor_verification(
        db,
        patient_id,
        prediction.id
    )

    if doctor_verification is None:

        raise HTTPException(
            status_code=403,
            detail=(
                "Doctor verification is required before "
                "generating the clinical report."
            )
        )

    # ---------------------------------------------------------
    # 6. Build ExplainRequest from EXACT stored features
    # ---------------------------------------------------------

    explain_data = ExplainRequest(

        patient_id=patient_id,

        admission_type=features["admission_type"],

        length_of_stay=features["length_of_stay"],

        gender=features["gender"],

        age=features["age"],

        Creatinine=features["Creatinine"],

        Glucose=features["Glucose"],

        Hemoglobin=features["Hemoglobin"],

        Platelet_Count=features["Platelet Count"],

        Potassium=features["Potassium"],

        Sodium=features["Sodium"],

        Urea_Nitrogen=features["Urea Nitrogen"],

        White_Blood_Cells=features["White Blood Cells"],

        age_group=features["age_group"],

        los_category=features["los_category"],

        diagnosis_count=features["diagnosis_count"],

        drug_count=features["drug_count"],

        culture_available=features["culture_available"],

        organism_count=features["organism_count"],

        broad_spectrum_used=features["broad_spectrum_used"],

        prior_antibiotic_exposure=features["prior_antibiotic_exposure"]
    )

    # ---------------------------------------------------------
    # 7. Generate ACTUAL SHAP Explanation
    # ---------------------------------------------------------

    explanation = explain_prediction(
        db,
        explain_data
    )

    # ---------------------------------------------------------
    # 8. Get Recommendation
    # ---------------------------------------------------------

    recommendation = get_recommendation(
        db,
        prediction.id
    )

    if recommendation is None:

        raise HTTPException(
            status_code=404,
            detail="Recommendation not found"
        )

    # ---------------------------------------------------------
    # 9. Prepare Complete Report Data
    # ---------------------------------------------------------

    report_data = {

        "report_id": generate_report_id(),

        "patient": patient,

        "clinical": clinical,

        "prediction": prediction,

        "recommendation": recommendation,

        "explanation": explanation,

        "doctor_verification": doctor_verification
    }

    # ---------------------------------------------------------
    # 10. Generate Professional PDF
    # ---------------------------------------------------------

    pdf_file = generate_pdf(report_data)

    return pdf_file