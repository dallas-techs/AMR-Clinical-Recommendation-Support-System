import pandas as pd

print("Reading processed diagnosis...")

diag = pd.read_csv("dataset/processed/diagnosis_processed.csv")

diag = diag.dropna(subset=["icd_code"])

diag_final = diag.groupby(
    ["subject_id", "hadm_id"]
)["icd_code"].apply(
    lambda x: ", ".join(sorted(set(x.astype(str))))
).reset_index()

diag_final.rename(
    columns={"icd_code": "diagnoses"},
    inplace=True
)

diag_final.to_csv(
    "dataset/processed/diagnosis_final.csv",
    index=False
)

print("✅ diagnosis_final.csv created")
print(diag_final.head())