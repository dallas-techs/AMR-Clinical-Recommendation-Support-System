import pandas as pd

print("Reading diagnosis dataset...")

# Read dataset
diagnosis = pd.read_csv("dataset/raw/diagnoses_icd.csv")

# Select required columns
diagnosis = diagnosis[
    [
        "subject_id",
        "hadm_id",
        "icd_code",
        "icd_version"
    ]
]

# Remove duplicate rows
diagnosis = diagnosis.drop_duplicates()

# Save processed dataset
diagnosis.to_csv(
    "dataset/processed/diagnosis_processed.csv",
    index=False
)

print("✅ diagnosis_processed.csv created successfully")
print(diagnosis.head())