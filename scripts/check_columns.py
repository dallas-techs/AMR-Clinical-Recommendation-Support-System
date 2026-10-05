import pandas as pd

files = [
    "dataset/final/labs_final.csv",
    "dataset/final/diagnosis_final.csv",
    "dataset/final/prescriptions_final.csv",
    "dataset/final/microbiology_final.csv"
]

for file in files:
    df = pd.read_csv(file)

    print("\n" + "=" * 60)
    print(file)
    print("=" * 60)
    print("Columns:")
    print(df.columns.tolist())
    print("\nShape:")
    print(df.shape)