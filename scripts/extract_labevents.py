import pandas as pd

print("Reading labevents dataset...")

# Read datasets
labs = pd.read_csv("dataset/raw/labevents.csv")
labitems = pd.read_csv("dataset/raw/d_labitems.csv")

# Required Lab Tests
required_tests = [
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

# Get required item IDs
required_ids = labitems[
    labitems["label"].isin(required_tests)
]["itemid"]

# Filter lab events
labs = labs[
    labs["itemid"].isin(required_ids)
]

# Keep only required columns
labs = labs[
    [
        "subject_id",
        "hadm_id",
        "charttime",
        "itemid",
        "valuenum"
    ]
]

# Merge with lab names
labs = labs.merge(
    labitems[["itemid", "label"]],
    on="itemid",
    how="left"
)

# Save processed dataset
labs.to_csv(
    "dataset/processed/labevents_processed.csv",
    index=False
)

print("✅ labevents_processed.csv created successfully")
print(labs.head())
print("Total Records :", len(labs))