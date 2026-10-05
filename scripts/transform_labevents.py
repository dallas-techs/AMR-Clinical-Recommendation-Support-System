import pandas as pd

print("Reading processed labevents...")

# Read processed lab events
labs = pd.read_csv("dataset/processed/labevents_processed.csv")

# Keep only required columns
labs = labs[
    [
        "subject_id",
        "hadm_id",
        "label",
        "valuenum"
    ]
]

# Remove rows with missing values
labs = labs.dropna(subset=["valuenum"])

# Pivot table
labs_pivot = labs.pivot_table(
    index=["subject_id", "hadm_id"],
    columns="label",
    values="valuenum",
    aggfunc="mean"
).reset_index()

# Remove column index name
labs_pivot.columns.name = None

# Save transformed dataset
labs_pivot.to_csv(
    "dataset/processed/labs_final.csv",
    index=False
)

print("✅ labs_final.csv created successfully")
print(labs_pivot.head())
print("Rows :", len(labs_pivot))