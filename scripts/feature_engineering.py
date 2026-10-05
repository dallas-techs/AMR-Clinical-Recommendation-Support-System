import pandas as pd
import numpy as np
INPUT_FILE = "dataset/final/cleaned_amr_dataset.csv"
OUTPUT_FILE = "dataset/final/featured_amr_dataset.csv"

df = pd.read_csv(INPUT_FILE)

print("=" * 60)
print("Feature Engineering Started")
print("=" * 60)
def age_group(age):
    if age <= 17:
        return "Child"
    elif age <= 39:
        return "Young Adult"
    elif age <= 64:
        return "Adult"
    else:
        return "Elderly"

df["age_group"] = df["age"].apply(age_group)
def los_category(days):
    if days <= 3:
        return "Short"
    elif days <= 7:
        return "Medium"
    else:
        return "Long"

df["los_category"] = df["length_of_stay"].apply(los_category)
df["diagnosis_count"] = (
    df["diagnoses"]
    .fillna("")
    .apply(lambda x: len(str(x).split(";")) if x != "" else 0)
)
df["drug_count"] = (
    df["drugs"]
    .fillna("")
    .apply(lambda x: len(str(x).split(";")) if x != "" and x != "No_Drug" else 0)
)
df["culture_available"] = (
    df["org_name"] != "No_Culture"
).astype(int)
df["resistance_present"] = (
    df["antibiotic_results"]
    .str.contains(":R", na=False)
    .astype(int)
)
df["organism_count"] = (
    df["org_name"]
    .fillna("")
    .apply(lambda x: len(str(x).split(";")) if x != "" and x != "No_Culture" else 0)
)
df["antibiotic_test_count"] = (
    df["antibiotic_results"]
    .fillna("")
    .apply(lambda x: len(str(x).split(";")) if x != "" and x != "No_Test" else 0)
)
broad_spectrum = [
    "Meropenem",
    "Imipenem",
    "Piperacillin",
    "Tazobactam",
    "Cefepime",
    "Vancomycin",
    "Linezolid",
    "Colistin"
]

def broad_flag(drugs):

    drugs = str(drugs).lower()

    for drug in broad_spectrum:
        if drug.lower() in drugs:
            return 1

    return 0

df["broad_spectrum_used"] = df["drugs"].apply(broad_flag)
df["prior_antibiotic_exposure"] = (
    df["drugs"] != "No_Drug"
).astype(int)
print("\nDataset Shape :", df.shape)

print("\nNew Features Added:")

new_features = [
    "age_group",
    "los_category",
    "diagnosis_count",
    "drug_count",
    "culture_available",
    "resistance_present",
    "organism_count",
    "antibiotic_test_count",
    "broad_spectrum_used",
    "prior_antibiotic_exposure"
]

print(df[new_features].head())
df.to_csv(OUTPUT_FILE, index=False)

print("\nFeature Engineering Completed Successfully.")
print("Output Saved :", OUTPUT_FILE)