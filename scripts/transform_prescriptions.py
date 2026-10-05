import pandas as pd

print("Reading processed prescriptions...")

# Read processed prescriptions
pres = pd.read_csv("dataset/processed/prescriptions_processed.csv")

# Remove missing drugs
pres = pres.dropna(subset=["drug"])

# Group all drugs by patient admission
pres_final = pres.groupby(
    ["subject_id", "hadm_id"]
)["drug"].apply(
    lambda x: ", ".join(sorted(set(x.astype(str))))
).reset_index()

# Rename column
pres_final.rename(
    columns={"drug": "drugs"},
    inplace=True
)

# Save
pres_final.to_csv(
    "dataset/processed/prescriptions_final.csv",
    index=False
)

print("✅ prescriptions_final.csv created successfully")
print(pres_final.head())
print("Rows :", len(pres_final))