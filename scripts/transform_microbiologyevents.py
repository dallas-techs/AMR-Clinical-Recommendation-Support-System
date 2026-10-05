import pandas as pd

print("Reading processed microbiology...")

# ==========================================================
# Load Processed Microbiology Data
# ==========================================================

micro = pd.read_csv(
    "dataset/processed/microbiologyevents_processed.csv"
)

# ==========================================================
# Remove Missing Values
# ==========================================================

micro = micro.dropna(
    subset=["org_name", "ab_name", "interpretation"]
)

# ==========================================================
# Create Antibiotic Result
# Example:
# MEROPENEM:R
# ==========================================================

micro["result"] = (
    micro["ab_name"].astype(str) +
    ":" +
    micro["interpretation"].astype(str)
)

# ==========================================================
# Aggregate Per Admission
# One Admission = One Row
# ==========================================================

micro_final = micro.groupby(
    ["subject_id", "hadm_id"]
).agg(
    {
        "org_name": lambda x: "; ".join(sorted(set(x.astype(str)))),
        "result": lambda x: "; ".join(sorted(set(x.astype(str))))
    }
).reset_index()

# ==========================================================
# Rename Columns
# ==========================================================

micro_final.rename(
    columns={
        "result": "antibiotic_results"
    },
    inplace=True
)

# ==========================================================
# Save Final Dataset
# ==========================================================

micro_final.to_csv(
    "dataset/final/microbiology_final.csv",
    index=False
)

print("\nMicrobiology Transformation Completed Successfully!")
print(f"Final Shape : {micro_final.shape}")

print("\nSample Data:")
print(micro_final.head())