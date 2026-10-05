import pandas as pd

print("Reading patients dataset...")

patients = pd.read_csv("dataset/raw/patients.csv")

patients = patients[[
    "subject_id",
    "gender",
    "anchor_age"
]]

patients = patients.rename(
    columns={
        "anchor_age": "age"
    }
)

patients.to_csv(
    "dataset/processed/patients_processed.csv",
    index=False
)

print("✅ patients_processed.csv created successfully")
print(patients.head())