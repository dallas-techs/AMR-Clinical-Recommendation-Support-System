import pandas as pd

print("Reading labitems dataset...")

labitems = pd.read_csv(
    "dataset/raw/d_labitems.csv"
)

required = [
    "Creatinine",
    "White Blood Cells",
    "Hemoglobin",
    "Platelet Count",
    "Sodium",
    "Potassium",
    "Glucose",
    "Urea Nitrogen",
    "C-Reactive Protein"
]

labitems = labitems[
    labitems["label"].isin(required)
]

labitems.to_csv(
    "dataset/processed/labitems_processed.csv",
    index=False
)

print("Labitems Done")
print(labitems)