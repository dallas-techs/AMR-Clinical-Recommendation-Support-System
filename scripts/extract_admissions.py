import pandas as pd

print("Reading admissions dataset...")

# Read dataset
admissions = pd.read_csv("dataset/raw/admissions.csv")

# Select required columns
admissions = admissions[
    [
        "subject_id",
        "hadm_id",
        "admittime",
        "dischtime",
        "admission_type"
    ]
]

# Save processed dataset
admissions.to_csv(
    "dataset/processed/admissions_processed.csv",
    index=False
)

print("✅ admissions_processed.csv created successfully")
print(admissions.head())