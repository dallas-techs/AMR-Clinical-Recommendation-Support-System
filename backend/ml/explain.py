# ==========================================
# SHAP Explainability
# ==========================================

import pandas as pd
import shap
import joblib
import matplotlib.pyplot as plt

# Load Dataset
df = pd.read_csv("../../dataset/final/preprocessed_amr_dataset.csv")

X = df.drop("amr_label", axis=1)

# Load Model
model = joblib.load("models/amr_model.pkl")

# Create SHAP Explainer
explainer = shap.TreeExplainer(model)

# Calculate SHAP Values
shap_values = explainer.shap_values(X)

print("=" * 50)
print("SHAP Values Generated Successfully")
print("=" * 50)

# Summary Plot
shap.summary_plot(shap_values, X)