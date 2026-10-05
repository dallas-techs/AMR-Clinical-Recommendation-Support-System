import pandas as pd
from pathlib import Path

# ==========================================================
# File Paths
# ==========================================================

INPUT_FILE = Path("dataset/final/final_dataset.csv")
OUTPUT_FILE = Path("dataset/final/final_amr_dataset.csv")

# ==========================================================
# Load Dataset
# ==========================================================

print("Loading final dataset...")

df = pd.read_csv(INPUT_FILE)

print(f"Dataset Loaded Successfully!")
print(f"Shape : {df.shape}")

# ==========================================================
# Create AMR Target Variable
# Rule:
# If antibiotic_results contains ':R'
# then AMR = 1
# Else AMR = 0
# ==========================================================

def create_amr_label(result):

    if pd.isna(result):
        return 0

    result = str(result).upper()

    if ":R" in result:
        return 1

    return 0


df["amr_label"] = df["antibiotic_results"].apply(create_amr_label)

# ==========================================================
# Display Label Distribution
# ==========================================================

print("\nAMR Label Distribution")
print("-" * 40)
print(df["amr_label"].value_counts())

# ==========================================================
# Display Percentage
# ==========================================================

print("\nAMR Percentage")
print("-" * 40)

percentage = (
    df["amr_label"]
    .value_counts(normalize=True)
    * 100
).round(2)

print(percentage)

# ==========================================================
# Save Dataset
# ==========================================================

df.to_csv(OUTPUT_FILE, index=False)

print("\nDataset Saved Successfully!")
print(f"Output File : {OUTPUT_FILE}")
print(f"Final Shape : {df.shape}")

print("\nTarget Variable Created Successfully!")