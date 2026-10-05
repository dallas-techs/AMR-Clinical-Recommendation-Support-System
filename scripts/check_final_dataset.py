import pandas as pd

df = pd.read_csv("dataset/final/final_dataset.csv")

print("=" * 60)
print("Shape")
print("=" * 60)
print(df.shape)

print("\n" + "=" * 60)
print("Columns")
print("=" * 60)
print(df.columns.tolist())

print("\n" + "=" * 60)
print("Data Types")
print("=" * 60)
print(df.dtypes)