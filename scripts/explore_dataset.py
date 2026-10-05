import pandas as pd

# ==========================================================
# Load Dataset
# ==========================================================

df = pd.read_csv("dataset/final/final_dataset.csv")

print("=" * 60)
print("FINAL DATASET ANALYSIS")
print("=" * 60)

# ==========================================================
# Shape
# ==========================================================

print("\nDataset Shape")
print("-" * 30)
print(df.shape)

# ==========================================================
# Columns
# ==========================================================

print("\nColumns")
print("-" * 30)

for col in df.columns:
    print(col)

# ==========================================================
# Data Types
# ==========================================================

print("\nData Types")
print("-" * 30)
print(df.dtypes)

# ==========================================================
# Missing Values
# ==========================================================

print("\nMissing Values")
print("-" * 30)
print(df.isnull().sum())

# ==========================================================
# Gender Distribution
# ==========================================================

print("\nGender Distribution")
print("-" * 30)
print(df["gender"].value_counts(dropna=False))

# ==========================================================
# Admission Types
# ==========================================================

print("\nAdmission Types")
print("-" * 30)
print(df["admission_type"].value_counts(dropna=False))

# ==========================================================
# Top Diagnoses
# ==========================================================

print("\nTop Diagnosis Entries")
print("-" * 30)
print(df["diagnoses"].value_counts().head(10))

# ==========================================================
# Top Drugs
# ==========================================================

print("\nTop Drug Entries")
print("-" * 30)
print(df["drugs"].value_counts().head(10))

# ==========================================================
# Organisms
# ==========================================================

print("\nUnique Organisms")
print("-" * 30)
print(df["org_name"].dropna().unique())

# ==========================================================
# Antibiotic Results
# ==========================================================

print("\nUnique Antibiotic Results")
print("-" * 30)
print(df["antibiotic_results"].dropna().unique())

# ==========================================================
# Numerical Summary
# ==========================================================

print("\nNumerical Summary")
print("-" * 30)
print(df.describe())

print("\nAnalysis Completed Successfully.")