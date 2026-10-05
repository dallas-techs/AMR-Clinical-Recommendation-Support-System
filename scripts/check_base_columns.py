import pandas as pd

files = [
    "dataset/processed/patients_processed.csv",
    "dataset/processed/admissions_processed.csv"
]

for file in files:
    df = pd.read_csv(file)

    print("\n" + "=" * 60)
    print(file)
    print("=" * 60)
    print(df.columns.tolist())
    print(df.shape)