# ==========================================
# AMR Dataset Preprocessing
# ==========================================

import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Load Dataset
dataset_path = "../../dataset/final/featured_amr_dataset.csv"

df = pd.read_csv(dataset_path)

print("=" * 50)
print("Original Dataset Shape:", df.shape)

# ------------------------------------------
# Drop Unnecessary Columns
# ------------------------------------------

drop_columns = [
    "subject_id",
    "hadm_id",
    "admittime",
    "dischtime",
    "diagnoses",
    "drugs",
    "org_name",
    "antibiotic_results",
    "resistance_present",
    "antibiotic_test_count"
]

df.drop(columns=drop_columns, inplace=True)

print("\nDataset Shape after Dropping Columns:", df.shape)

# ------------------------------------------
# Encode Categorical Columns
# ------------------------------------------

categorical_columns = [
    "gender",
    "admission_type",
    "age_group",
    "los_category"
]

encoder = LabelEncoder()

for col in categorical_columns:
    print(f"\n{col} original values:")
    print(df[col].dropna().unique())

    df[col] = encoder.fit_transform(df[col])

    print(f"{col} encoding:")
    print(dict(zip(encoder.classes_, encoder.transform(encoder.classes_))))

print("\nCategorical Columns Encoded Successfully")

# ------------------------------------------
# Check Missing Values
# ------------------------------------------

print("\nMissing Values:")
print(df.isnull().sum())

# ------------------------------------------
# Separate Features and Target
# ------------------------------------------

X = df.drop("amr_label", axis=1)
y = df["amr_label"]

print("\nFeature Matrix Shape:", X.shape)
print("Target Shape:", y.shape)

print("\nFeature Names:")
print(X.columns.tolist())

# ------------------------------------------
# Save Processed Dataset
# ------------------------------------------

output_path = "../../dataset/final/preprocessed_amr_dataset.csv"

df.to_csv(output_path, index=False)

print("\nPreprocessed Dataset Saved Successfully!")
print("Location:", output_path)