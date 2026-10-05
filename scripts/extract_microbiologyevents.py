import pandas as pd

print("Reading microbiologyevents dataset...")

# Read dataset
micro = pd.read_csv("dataset/raw/microbiologyevents.csv")

# Select required columns
micro = micro[
    [
        "subject_id",
        "hadm_id",
        "charttime",
        "spec_type_desc",
        "org_name",
        "ab_name",
        "interpretation"
    ]
]

# Remove duplicates
micro = micro.drop_duplicates()

# Save processed dataset
micro.to_csv(
    "dataset/processed/microbiologyevents_processed.csv",
    index=False
)

print("✅ microbiologyevents_processed.csv created successfully")
print(micro.head())
print("Total Records:", len(micro))