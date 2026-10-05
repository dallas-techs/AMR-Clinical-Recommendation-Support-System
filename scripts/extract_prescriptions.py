import pandas as pd

print("Reading prescriptions dataset...")

# Read dataset
prescriptions = pd.read_csv("dataset/raw/prescriptions.csv")

# Required columns
prescriptions = prescriptions[
    [
        "subject_id",
        "hadm_id",
        "starttime",
        "stoptime",
        "drug",
        "route"
    ]
]

# Remove duplicates
prescriptions = prescriptions.drop_duplicates()

# Save
prescriptions.to_csv(
    "dataset/processed/prescriptions_processed.csv",
    index=False
)

print("✅ prescriptions_processed.csv created successfully")
print(prescriptions.head())
print("Total Records:", len(prescriptions))