import pandas as pd
from pathlib import Path

# ==========================================================
# File Paths
# ==========================================================

INPUT_FILE = Path("dataset/final/final_amr_dataset.csv")
OUTPUT_FILE = Path("dataset/final/cleaned_amr_dataset.csv")

# ==========================================================
# Load Dataset
# ==========================================================

print("Loading dataset...")

df = pd.read_csv(INPUT_FILE)

print(f"Dataset Loaded Successfully!")
print(f"Shape : {df.shape}")

# ==========================================================
# Dataset Information
# ==========================================================

print("\nDataset Information")
print("-" * 50)
print(df.info())

# ==========================================================
# Duplicate Check
# ==========================================================

duplicates = df.duplicated().sum()

print("\nDuplicate Rows")
print("-" * 50)
print(duplicates)

# ==========================================================
# Missing Values
# ==========================================================

print("\nMissing Values")
print("-" * 50)
print(df.isnull().sum())

# ==========================================================
# Drop Columns with More Than 90% Missing Values
# ==========================================================

threshold = len(df) * 0.90

high_missing_columns = df.columns[df.isnull().sum() > threshold]

print("\nColumns Dropped (>90% Missing)")
print("-" * 50)
print(list(high_missing_columns))

df.drop(columns=high_missing_columns, inplace=True)

# ==========================================================
# Convert Date Columns
# ==========================================================

df["admittime"] = pd.to_datetime(df["admittime"])
df["dischtime"] = pd.to_datetime(df["dischtime"])

# ==========================================================
# Fill Numerical Missing Values
# ==========================================================

numeric_columns = df.select_dtypes(include=["float64", "int64"]).columns

for column in numeric_columns:

    if df[column].isnull().sum() > 0:
        df[column].fillna(df[column].median(), inplace=True)

# ==========================================================
# Fill Categorical Missing Values
# ==========================================================

fill_values = {
    "drugs": "No_Drug",
    "org_name": "No_Culture",
    "antibiotic_results": "No_Test"
}

for column, value in fill_values.items():

    if column in df.columns:
        df[column].fillna(value, inplace=True)

# ==========================================================
# Validate Age
# ==========================================================

df = df[df["age"] >= 0]

# ==========================================================
# Validate Length of Stay
# ==========================================================

df = df[df["length_of_stay"] >= 0]

# ==========================================================
# Final Missing Values
# ==========================================================

print("\nMissing Values After Cleaning")
print("-" * 50)
print(df.isnull().sum())

# ==========================================================
# Save Clean Dataset
# ==========================================================

df.to_csv(OUTPUT_FILE, index=False)

print("\nCleaning Completed Successfully!")

print(f"Final Shape : {df.shape}")

print(f"Dataset Saved : {OUTPUT_FILE}")