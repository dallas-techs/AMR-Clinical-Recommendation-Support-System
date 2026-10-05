import joblib
import pandas as pd
import shap

from sqlalchemy.orm import Session

from app.models.prediction import Prediction
from app.schemas.explain import ExplainRequest


# ============================================================
# LOAD MODEL
# ============================================================

model = joblib.load("ml/models/amr_model.pkl")

# Create SHAP Tree Explainer
explainer = shap.TreeExplainer(model)


# ============================================================
# SHAP EXPLANATION
# ============================================================

def explain_prediction(
    db: Session,
    data: ExplainRequest
):

    # ---------------------------------------------------------
    # Get latest prediction for this patient
    # ---------------------------------------------------------

    prediction_record = (
        db.query(Prediction)
        .filter(
            Prediction.patient_id == data.patient_id
        )
        .order_by(
            Prediction.id.desc()
        )
        .first()
    )

    if prediction_record is None:
        raise ValueError(
            "Prediction not found for this patient"
        )

    # ---------------------------------------------------------
    # Get stored prediction input features
    # ---------------------------------------------------------

    stored_features = (
        prediction_record.input_features
    )

    if not stored_features:
        raise ValueError(
            "Prediction input features are not available"
        )

    # ---------------------------------------------------------
    # IMPORTANT:
    # The prediction record stores both:
    #
    # age_group          -> "Young Adult"
    # age_group_encoded  -> 2
    #
    # los_category       -> "Medium"
    # los_category_encoded -> 1
    #
    # The Random Forest model requires the encoded numeric
    # values. Therefore use the encoded values for SHAP.
    # ---------------------------------------------------------

    age_group_encoded = stored_features.get(
        "age_group_encoded"
    )

    los_category_encoded = stored_features.get(
        "los_category_encoded"
    )

    if age_group_encoded is None:
        raise ValueError(
            "Encoded age group is not available "
            "in the stored prediction."
        )

    if los_category_encoded is None:
        raise ValueError(
            "Encoded LOS category is not available "
            "in the stored prediction."
        )

    # ---------------------------------------------------------
    # Build EXACT model input
    # ---------------------------------------------------------

    input_data = pd.DataFrame([{

        "admission_type":
            stored_features["admission_type"],

        "length_of_stay":
            stored_features["length_of_stay"],

        "gender":
            stored_features["gender"],

        "age":
            stored_features["age"],

        "Creatinine":
            stored_features["Creatinine"],

        "Glucose":
            stored_features["Glucose"],

        "Hemoglobin":
            stored_features["Hemoglobin"],

        "Platelet Count":
            stored_features["Platelet Count"],

        "Potassium":
            stored_features["Potassium"],

        "Sodium":
            stored_features["Sodium"],

        "Urea Nitrogen":
            stored_features["Urea Nitrogen"],

        "White Blood Cells":
            stored_features["White Blood Cells"],

        # IMPORTANT:
        # Use encoded numeric values
        "age_group":
            age_group_encoded,

        "los_category":
            los_category_encoded,

        "diagnosis_count":
            stored_features["diagnosis_count"],

        "drug_count":
            stored_features["drug_count"],

        "culture_available":
            stored_features["culture_available"],

        "organism_count":
            stored_features["organism_count"],

        "broad_spectrum_used":
            stored_features["broad_spectrum_used"],

        "prior_antibiotic_exposure":
            stored_features[
                "prior_antibiotic_exposure"
            ]
    }])

    # ---------------------------------------------------------
    # EXACT MODEL FEATURE ORDER
    # ---------------------------------------------------------

    feature_order = [
        "admission_type",
        "length_of_stay",
        "gender",
        "age",
        "Creatinine",
        "Glucose",
        "Hemoglobin",
        "Platelet Count",
        "Potassium",
        "Sodium",
        "Urea Nitrogen",
        "White Blood Cells",
        "age_group",
        "los_category",
        "diagnosis_count",
        "drug_count",
        "culture_available",
        "organism_count",
        "broad_spectrum_used",
        "prior_antibiotic_exposure"
    ]

    input_data = input_data[
        feature_order
    ]

    # ---------------------------------------------------------
    # Ensure all model inputs are numeric
    # ---------------------------------------------------------

    input_data = input_data.astype(float)

    # ---------------------------------------------------------
    # CALCULATE SHAP VALUES
    # ---------------------------------------------------------

    shap_values = explainer.shap_values(
        input_data
    )

    # ---------------------------------------------------------
    # Handle Random Forest SHAP output
    # ---------------------------------------------------------

    if hasattr(shap_values, "ndim"):

        # Newer SHAP format:
        # (samples, features, classes)
        if shap_values.ndim == 3:

            values = shap_values[
                0, :, 1
            ]

        # Older SHAP format:
        # list[class][samples][features]
        elif shap_values.ndim == 2:

            values = shap_values[0]

        else:

            raise ValueError(
                "Unexpected SHAP output shape."
            )

    else:

        # Older SHAP versions may return
        # a list of arrays for classification
        values = shap_values[1][0]

    # ---------------------------------------------------------
    # CREATE FEATURE CONTRIBUTIONS
    # ---------------------------------------------------------

    contributions = []

    for feature, value in zip(
        input_data.columns,
        values
    ):

        contributions.append({
            "feature": feature,
            "contribution": round(
                float(value),
                4
            )
        })

    # ---------------------------------------------------------
    # SORT BY ABSOLUTE SHAP CONTRIBUTION
    # ---------------------------------------------------------

    contributions = sorted(
        contributions,
        key=lambda x: abs(
            x["contribution"]
        ),
        reverse=True
    )

    # ---------------------------------------------------------
    # RETURN TOP 5 FEATURES
    # ---------------------------------------------------------

    return {
        "prediction":
            prediction_record.prediction,

        "top_features":
            contributions[:5]
    }