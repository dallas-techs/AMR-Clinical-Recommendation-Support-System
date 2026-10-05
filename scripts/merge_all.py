import pandas as pd
from pathlib import Path

# ==========================================================
# File Paths
# ==========================================================

PROCESSED_PATH = Path("dataset/processed")
FINAL_PATH = Path("dataset/final")

# ==========================================================
# Load Datasets
# ==========================================================

print("Loading datasets...")

patients = pd.read_csv(PROCESSED_PATH / "patients_processed.csv")
admissions = pd.read_csv(PROCESSED_PATH / "admissions_processed.csv")

labs = pd.read_csv(FINAL_PATH / "labs_final.csv")
diagnosis = pd.read_csv(FINAL_PATH / "diagnosis_final.csv")
prescriptions = pd.read_csv(FINAL_PATH / "prescriptions_final.csv")
microbiology = pd.read_csv(FINAL_PATH / "microbiology_final.csv")

print("Datasets loaded successfully.\n")

# ==========================================================
# Display Dataset Shapes
# ==========================================================

print("Dataset Shapes")
print("-" * 40)

datasets = {
    "Patients": patients,
    "Admissions": admissions,
    "Labs": labs,
    "Diagnosis": diagnosis,
    "Prescriptions": prescriptions,
    "Microbiology": microbiology
}

for name, df in datasets.items():
    print(f"{name:<15}: {df.shape}")

print()

# ==========================================================
# Validate Required Columns
# ==========================================================

required_columns = {
    "patients": ["subject_id"],
    "admissions": ["subject_id", "hadm_id"],
    "labs": ["subject_id", "hadm_id"],
    "diagnosis": ["subject_id", "hadm_id"],
    "prescriptions": ["subject_id", "hadm_id"],
    "microbiology": ["subject_id", "hadm_id"]
}

tables = {
    "patients": patients,
    "admissions": admissions,
    "labs": labs,
    "diagnosis": diagnosis,
    "prescriptions": prescriptions,
    "microbiology": microbiology
}

print("Validating required columns...")

for table_name, required in required_columns.items():

    missing = [
        column
        for column in required
        if column not in tables[table_name].columns
    ]

    if missing:
        raise ValueError(
            f"{table_name} is missing columns: {missing}"
        )

print("All required columns are present.\n")

# ==========================================================
# Convert Date Columns
# ==========================================================

admissions["admittime"] = pd.to_datetime(admissions["admittime"])
admissions["dischtime"] = pd.to_datetime(admissions["dischtime"])

# ==========================================================
# Length of Stay
# ==========================================================

admissions["length_of_stay"] = (
    admissions["dischtime"] -
    admissions["admittime"]
).dt.days

print("Length of Stay calculated.\n")
# ==========================================================
# Merge Patients and Admissions
# ==========================================================

print("Merging Patients and Admissions...")

merged_df = pd.merge(
    admissions,
    patients,
    on="subject_id",
    how="left"
)

print(f"Shape after Patients Merge: {merged_df.shape}\n")

# ==========================================================
# Merge Labs
# ==========================================================

print("Merging Labs...")

merged_df = pd.merge(
    merged_df,
    labs,
    on=["subject_id", "hadm_id"],
    how="left"
)

print(f"Shape after Labs Merge: {merged_df.shape}\n")

# ==========================================================
# Merge Diagnosis
# ==========================================================

print("Merging Diagnosis...")

merged_df = pd.merge(
    merged_df,
    diagnosis,
    on=["subject_id", "hadm_id"],
    how="left"
)

print(f"Shape after Diagnosis Merge: {merged_df.shape}\n")

# ==========================================================
# Merge Prescriptions
# ==========================================================

print("Merging Prescriptions...")

merged_df = pd.merge(
    merged_df,
    prescriptions,
    on=["subject_id", "hadm_id"],
    how="left"
)

print(f"Shape after Prescriptions Merge: {merged_df.shape}\n")

# ==========================================================
# Merge Microbiology
# ==========================================================

print("Merging Microbiology...")

merged_df = pd.merge(
    merged_df,
    microbiology,
    on=["subject_id", "hadm_id"],
    how="left"
)

print(f"Shape after Microbiology Merge: {merged_df.shape}\n")
# ==========================================================
# Duplicate Admission Check
# ==========================================================

duplicate_count = merged_df.duplicated(subset=["hadm_id"]).sum()

print("=" * 50)
print("Duplicate Admission Check")
print("=" * 50)
print(f"Duplicate Admissions : {duplicate_count}\n")

# ==========================================================
# Missing Value Summary
# ==========================================================

print("=" * 50)
print("Missing Values")
print("=" * 50)

print(merged_df.isnull().sum())

# ==========================================================
# Save Final Dataset
# ==========================================================

output_file = FINAL_PATH / "final_dataset.csv"

merged_df.to_csv(output_file, index=False)

print("\n" + "=" * 50)
print("Merge Completed Successfully")
print("=" * 50)

print(f"Final Dataset Shape : {merged_df.shape}")
print(f"Dataset Saved To    : {output_file}")