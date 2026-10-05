import joblib
import pandas as pd
from sqlalchemy.orm import Session

from app.models.prediction import Prediction
from app.models.clinical_record import ClinicalRecord
from app.schemas.prediction import PredictionCreate

from app.services.feature_engineering_service import (
    generate_engineered_features
)


# ============================================================
# LOAD AI MODEL
# ============================================================

model = joblib.load("ml/models/amr_model.pkl")


# ============================================================
# VERIFIED LABEL ENCODER MAPPINGS
# ============================================================
# These mappings were obtained from the project's
# preprocess.py output.
#
# gender:
# F -> 0
# M -> 1
#
# admission_type:
# AMBULATORY OBSERVATION      -> 0
# DIRECT EMER.                -> 1
# DIRECT OBSERVATION          -> 2
# ELECTIVE                    -> 3
# EU OBSERVATION              -> 4
# EW EMER.                    -> 5
# OBSERVATION ADMIT           -> 6
# SURGICAL SAME DAY ADMISSION -> 7
# URGENT                      -> 8
#
# age_group:
# Adult       -> 0
# Elderly     -> 1
# Young Adult -> 2
#
# los_category:
# Long        -> 0
# Medium      -> 1
# Short       -> 2
# ============================================================


AGE_GROUP_MAP = {
    "Adult": 0,
    "Elderly": 1,
    "Young Adult": 2,
}


LOS_CATEGORY_MAP = {
    "Long": 0,
    "Medium": 1,
    "Short": 2,
}


# ============================================================
# AMR PREDICTION
# ============================================================

def predict_amr(
    db: Session,
    data: PredictionCreate
):

    # --------------------------------------------------------
    # Get latest clinical record for selected patient
    # --------------------------------------------------------

    clinical_record = (
        db.query(ClinicalRecord)
        .filter(
            ClinicalRecord.patient_id
            == data.patient_id
        )
        .order_by(
            ClinicalRecord.id.desc()
        )
        .first()
    )


    if clinical_record is None:
        raise ValueError(
            "No clinical record found for this patient."
        )


    # --------------------------------------------------------
    # Generate engineered features automatically
    # --------------------------------------------------------

    engineered_features = (
        generate_engineered_features(

            age=clinical_record.patient.age,

            length_of_stay=
                clinical_record.length_of_stay,

            diagnoses=
                clinical_record.diagnoses,

            drugs=
                clinical_record.drugs,

            org_name=
                clinical_record.org_name
        )
    )


    # --------------------------------------------------------
    # Convert categorical engineered features
    # into the exact numerical encoding used during training
    # --------------------------------------------------------

    age_group_value = (
        AGE_GROUP_MAP.get(
            engineered_features["age_group"]
        )
    )

    los_category_value = (
        LOS_CATEGORY_MAP.get(
            engineered_features["los_category"]
        )
    )


    # --------------------------------------------------------
    # Validate engineered categorical values
    # --------------------------------------------------------

    if age_group_value is None:
        raise ValueError(
            "Unsupported age group generated: "
            f"{engineered_features['age_group']}"
        )


    if los_category_value is None:
        raise ValueError(
            "Unsupported LOS category generated: "
            f"{engineered_features['los_category']}"
        )


    # --------------------------------------------------------
    # Create DataFrame with EXACT feature names
    # used during model training
    # --------------------------------------------------------

    input_data = pd.DataFrame([{

        "admission_type":
            data.admission_type,

        "length_of_stay":
            data.length_of_stay,

        "gender":
            data.gender,

        "age":
            data.age,

        "Creatinine":
            data.Creatinine,

        "Glucose":
            data.Glucose,

        "Hemoglobin":
            data.Hemoglobin,

        "Platelet Count":
            data.Platelet_Count,

        "Potassium":
            data.Potassium,

        "Sodium":
            data.Sodium,

        "Urea Nitrogen":
            data.Urea_Nitrogen,

        "White Blood Cells":
            data.White_Blood_Cells,

        # Automatically generated features
        "age_group":
            age_group_value,

        "los_category":
            los_category_value,

        "diagnosis_count":
            engineered_features[
                "diagnosis_count"
            ],

        "drug_count":
            engineered_features[
                "drug_count"
            ],

        "culture_available":
            engineered_features[
                "culture_available"
            ],

        "organism_count":
            engineered_features[
                "organism_count"
            ],

        "broad_spectrum_used":
            engineered_features[
                "broad_spectrum_used"
            ],

        "prior_antibiotic_exposure":
            engineered_features[
                "prior_antibiotic_exposure"
            ]
    }])


    # --------------------------------------------------------
    # Predict
    # --------------------------------------------------------

    prediction = int(
        model.predict(input_data)[0]
    )


    # --------------------------------------------------------
    # Class Probabilities
    # --------------------------------------------------------

    probabilities = model.predict_proba(
        input_data
    )[0]


    # --------------------------------------------------------
    # AMR Risk Score
    #
    # Class 1 = AMR Positive
    # --------------------------------------------------------

    risk_probability = float(
        probabilities[1]
    )

    risk_score = (
        risk_probability * 100
    )


    # --------------------------------------------------------
    # Model Confidence
    #
    # Probability of the predicted class
    # --------------------------------------------------------

    confidence = float(
        max(probabilities)
    )


    # --------------------------------------------------------
    # Convert Prediction
    # --------------------------------------------------------

    if prediction == 1:

        result = "High AMR Risk"
        risk_level = "High"

    else:

        result = "Low AMR Risk"
        risk_level = "Low"


    # --------------------------------------------------------
    # Store EXACT feature values used for prediction
    # --------------------------------------------------------

    input_features = {

        "admission_type":
            data.admission_type,

        "length_of_stay":
            data.length_of_stay,

        "gender":
            data.gender,

        "age":
            data.age,

        "Creatinine":
            data.Creatinine,

        "Glucose":
            data.Glucose,

        "Hemoglobin":
            data.Hemoglobin,

        "Platelet Count":
            data.Platelet_Count,

        "Potassium":
            data.Potassium,

        "Sodium":
            data.Sodium,

        "Urea Nitrogen":
            data.Urea_Nitrogen,

        "White Blood Cells":
            data.White_Blood_Cells,

        # Store both human-readable and encoded values
        "age_group":
            engineered_features[
                "age_group"
            ],

        "age_group_encoded":
            age_group_value,

        "los_category":
            engineered_features[
                "los_category"
            ],

        "los_category_encoded":
            los_category_value,

        "diagnosis_count":
            engineered_features[
                "diagnosis_count"
            ],

        "drug_count":
            engineered_features[
                "drug_count"
            ],

        "culture_available":
            engineered_features[
                "culture_available"
            ],

        "organism_count":
            engineered_features[
                "organism_count"
            ],

        "broad_spectrum_used":
            engineered_features[
                "broad_spectrum_used"
            ],

        "prior_antibiotic_exposure":
            engineered_features[
                "prior_antibiotic_exposure"
            ]
    }


    # --------------------------------------------------------
    # Save Prediction
    # --------------------------------------------------------

    db_prediction = Prediction(

        patient_id=data.patient_id,

        risk_score=risk_score,

        prediction=result,

        risk_level=risk_level,

        confidence=confidence,

        model_version="RandomForest v1.0",

        input_features=input_features
    )


    db.add(db_prediction)

    db.commit()

    db.refresh(db_prediction)


    return db_prediction
# ============================================================
# GET PREDICTION HISTORY
# ============================================================

def get_prediction_history(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    risk_level: str = None,
    patient_id: int = None
):

    query = db.query(Prediction)

    if risk_level and risk_level.lower() != "all":
        query = query.filter(Prediction.risk_level == risk_level)

    if patient_id:
        query = query.filter(Prediction.patient_id == patient_id)

    return (
        query
        .order_by(Prediction.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )