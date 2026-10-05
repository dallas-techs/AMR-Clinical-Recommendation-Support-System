import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# -------------------------------------------------
# Common Plot Functions
# -------------------------------------------------

plt.style.use("ggplot")
sns.set_theme(style="whitegrid")


def plot_bar_chart(data, x, title, xlabel, ylabel, filename):

    plt.figure(figsize=(8,5))

    ax = sns.countplot(data=data, x=x)

    for container in ax.containers:
        ax.bar_label(container)

    plt.title(title, fontsize=14, weight="bold")
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)

    plt.xticks(rotation=20)

    plt.tight_layout()

    plt.savefig(
        os.path.join(PLOT_DIR, filename),
        dpi=300
    )

    plt.close()

    print(f"{filename} saved.")


def plot_histogram(data, column, title, xlabel, filename):

    plt.figure(figsize=(8,5))

    sns.histplot(
        data[column],
        bins=20,
        kde=True
    )

    plt.title(title, fontsize=14, weight="bold")

    plt.xlabel(xlabel)

    plt.ylabel("Frequency")

    plt.tight_layout()

    plt.savefig(
        os.path.join(PLOT_DIR, filename),
        dpi=300
    )

    plt.close()

    print(f"{filename} saved.")
def demographic_analysis(df):

    print("\nGenerating Demographic Charts...\n")

    plot_histogram(
        df,
        "age",
        "Age Distribution",
        "Age",
        "age_distribution.png"
    )

    plot_bar_chart(
        df,
        "age_group",
        "Age Group Distribution",
        "Age Group",
        "Patients",
        "age_group_distribution.png"
    )

    plot_bar_chart(
        df,
        "gender",
        "Gender Distribution",
        "Gender",
        "Patients",
        "gender_distribution.png"
    )

    plot_bar_chart(
        df,
        "admission_type",
        "Admission Type Distribution",
        "Admission Type",
        "Admissions",
        "admission_type_distribution.png"
    )

    plot_histogram(
        df,
        "length_of_stay",
        "Length of Stay Distribution",
        "Length of Stay (Days)",
        "los_distribution.png"
    )

    plot_bar_chart(
        df,
        "los_category",
        "Length of Stay Category",
        "LOS Category",
        "Patients",
        "los_category_distribution.png"
    )
# -----------------------------
# Paths
# -----------------------------
INPUT_FILE = "dataset/final/featured_amr_dataset.csv"

PLOT_DIR = "docs/eda/plots"
REPORT_DIR = "docs/eda/reports"

os.makedirs(PLOT_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)


def load_dataset():
    """Load the dataset."""

    if not os.path.exists(INPUT_FILE):
        raise FileNotFoundError(f"Dataset not found: {INPUT_FILE}")

    df = pd.read_csv(INPUT_FILE)
    return df


def dataset_summary(df):
    """Generate dataset summary."""

    print("=" * 60)
    print("DATASET SUMMARY")
    print("=" * 60)

    print(f"Rows    : {df.shape[0]}")
    print(f"Columns : {df.shape[1]}")

    print("\nColumn Names:")
    print(df.columns.tolist())

    print("\nData Types:")
    print(df.dtypes)

    print("\nDuplicate Rows :", df.duplicated().sum())

    print("\nMissing Values:")
    print(df.isnull().sum())

    summary_path = os.path.join(REPORT_DIR, "summary_report.txt")

    with open(summary_path, "w") as f:

        f.write("AMR DATASET SUMMARY\n")
        f.write("=" * 50 + "\n\n")

        f.write(f"Rows : {df.shape[0]}\n")
        f.write(f"Columns : {df.shape[1]}\n\n")

        f.write("Data Types\n")
        f.write(str(df.dtypes))
        f.write("\n\n")

        f.write("Missing Values\n")
        f.write(str(df.isnull().sum()))
        f.write("\n\n")

        f.write(f"Duplicate Rows : {df.duplicated().sum()}\n")

    print("\nSummary report saved.")


def missing_value_analysis(df):

    missing = df.isnull().sum()

    missing_df = pd.DataFrame({
        "Column": missing.index,
        "Missing Values": missing.values
    })

    missing_df.to_csv(
        os.path.join(REPORT_DIR, "missing_values.csv"),
        index=False
    )

    plt.figure(figsize=(10,5))

    sns.barplot(
        data=missing_df,
        x="Column",
        y="Missing Values"
    )

    plt.xticks(rotation=90)
    plt.title("Missing Values by Feature")

    plt.tight_layout()

    plt.savefig(
        os.path.join(PLOT_DIR, "missing_values.png"),
        dpi=300
    )

    plt.close()

    print("Missing value analysis completed.")


def target_distribution(df):

    plt.figure(figsize=(6,5))

    sns.countplot(
        x="amr_label",
        data=df
    )

    plt.title("AMR Class Distribution")

    plt.xlabel("AMR Label")

    plt.ylabel("Count")

    plt.tight_layout()

    plt.savefig(
        os.path.join(PLOT_DIR, "amr_distribution.png"),
        dpi=300
    )

    plt.close()

    print("AMR distribution chart saved.")

def main():

    print("=" * 60)
    print("EDA STARTED")
    print("=" * 60)

    df = load_dataset()

    dataset_summary(df)

    missing_value_analysis(df)

    target_distribution(df)

    demographic_analysis(df)

    print("\nEDA PART 2 COMPLETED SUCCESSFULLY")

    print("\nReports Location : docs/eda/reports/")
    print("Plots Location   : docs/eda/plots/")


if __name__ == "__main__":
    main()