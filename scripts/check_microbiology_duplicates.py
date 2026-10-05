import pandas as pd

df = pd.read_csv("dataset/final/microbiology_final.csv")

print(df.shape)

print("\nDuplicate hadm_id:")
print(df["hadm_id"].duplicated().sum())

print("\nTop duplicate hadm_id:")
print(df["hadm_id"].value_counts().head(10))