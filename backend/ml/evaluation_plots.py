import os

import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    ConfusionMatrixDisplay,
    roc_curve
)


# ============================================================
# 1. PATHS
# ============================================================

DATASET_PATH = "../../dataset/final/preprocessed_amr_dataset.csv"

OUTPUT_DIR = "evaluation"

os.makedirs(OUTPUT_DIR, exist_ok=True)


# ============================================================
# 2. LOAD DATASET
# ============================================================

df = pd.read_csv(DATASET_PATH)

X = df.drop("amr_label", axis=1)
y = df["amr_label"]


print("=" * 60)
print("AMR MODEL EVALUATION VISUALIZATION")
print("=" * 60)

print(f"Dataset shape: {df.shape}")
print(f"Feature matrix shape: {X.shape}")

print("\nTarget distribution:")
print(y.value_counts())


# ============================================================
# 3. SAME TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(X_train))
print("Testing samples :", len(X_test))


# ============================================================
# 4. DEFINE MODELS
# ============================================================

models = {
    "Logistic Regression": LogisticRegression(max_iter=2000),
    "Decision Tree": DecisionTreeClassifier(
        random_state=42
    ),
    "Random Forest": RandomForestClassifier(
        random_state=42
    )
}


# ============================================================
# 5. TRAIN + EVALUATE
# ============================================================

results = []
roc_data = {}
confusion_matrices = {}

for name, model in models.items():

    print(f"\nTraining: {name}")

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(
        y_test,
        y_pred,
        zero_division=0
    )
    recall = recall_score(
        y_test,
        y_pred,
        zero_division=0
    )
    f1 = f1_score(
        y_test,
        y_pred,
        zero_division=0
    )
    roc_auc = roc_auc_score(
        y_test,
        y_prob
    )

    results.append({
        "Model": name,
        "Accuracy": accuracy,
        "Precision": precision,
        "Recall": recall,
        "F1-Score": f1,
        "ROC-AUC": roc_auc
    })

    fpr, tpr, _ = roc_curve(
        y_test,
        y_prob
    )

    roc_data[name] = {
        "fpr": fpr,
        "tpr": tpr,
        "auc": roc_auc
    }

    confusion_matrices[name] = confusion_matrix(
        y_test,
        y_pred
    )

    print(f"Accuracy : {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1-Score : {f1:.4f}")
    print(f"ROC-AUC  : {roc_auc:.4f}")


results_df = pd.DataFrame(results)


# ============================================================
# 6. SAVE FINAL RESULTS
# ============================================================

results_path = os.path.join(
    OUTPUT_DIR,
    "model_evaluation_results.csv"
)

results_df.to_csv(
    results_path,
    index=False
)


# ============================================================
# 7. MODEL COMPARISON CHART
# ============================================================

metrics = [
    "Accuracy",
    "Precision",
    "Recall",
    "F1-Score",
    "ROC-AUC"
]

ax = results_df.set_index("Model")[metrics].plot(
    kind="bar",
    figsize=(12, 7)
)

ax.set_title(
    "AMR Model Performance Comparison"
)

ax.set_ylabel(
    "Score"
)

ax.set_xlabel(
    "Model"
)

ax.set_ylim(
    0,
    1.05
)

plt.xticks(
    rotation=0
)

plt.legend(
    loc="lower right"
)

plt.tight_layout()

comparison_path = os.path.join(
    OUTPUT_DIR,
    "model_comparison.png"
)

plt.savefig(
    comparison_path,
    dpi=300,
    bbox_inches="tight"
)

plt.close()


# ============================================================
# 8. ROC CURVE
# ============================================================

plt.figure(figsize=(10, 7))

for name, data in roc_data.items():

    plt.plot(
        data["fpr"],
        data["tpr"],
        linewidth=2,
        label=f"{name} (AUC = {data['auc']:.3f})"
    )

plt.plot(
    [0, 1],
    [0, 1],
    linestyle="--",
    linewidth=1
)

plt.xlabel(
    "False Positive Rate"
)

plt.ylabel(
    "True Positive Rate"
)

plt.title(
    "ROC Curve Comparison"
)

plt.legend(
    loc="lower right"
)

plt.grid(
    alpha=0.3
)

plt.tight_layout()

roc_path = os.path.join(
    OUTPUT_DIR,
    "roc_curve.png"
)

plt.savefig(
    roc_path,
    dpi=300,
    bbox_inches="tight"
)

plt.close()


# ============================================================
# 9. RANDOM FOREST CONFUSION MATRIX
# ============================================================

rf_cm = confusion_matrices["Random Forest"]

disp = ConfusionMatrixDisplay(
    confusion_matrix=rf_cm,
    display_labels=[
        "Non-AMR",
        "AMR"
    ]
)

fig, ax = plt.subplots(
    figsize=(7, 6)
)

disp.plot(
    ax=ax,
    values_format="d"
)

ax.set_title(
    "Random Forest Confusion Matrix"
)

plt.tight_layout()

rf_cm_path = os.path.join(
    OUTPUT_DIR,
    "confusion_matrix_random_forest.png"
)

plt.savefig(
    rf_cm_path,
    dpi=300,
    bbox_inches="tight"
)

plt.close()


# ============================================================
# 10. ALL MODEL CONFUSION MATRICES
# ============================================================

fig, axes = plt.subplots(
    1,
    3,
    figsize=(15, 5)
)

for ax, (name, cm) in zip(
    axes,
    confusion_matrices.items()
):

    disp = ConfusionMatrixDisplay(
        confusion_matrix=cm,
        display_labels=[
            "Non-AMR",
            "AMR"
        ]
    )

    disp.plot(
        ax=ax,
        values_format="d"
    )

    ax.set_title(name)

plt.tight_layout()

all_cm_path = os.path.join(
    OUTPUT_DIR,
    "confusion_matrices_all_models.png"
)

plt.savefig(
    all_cm_path,
    dpi=300,
    bbox_inches="tight"
)

plt.close()


# ============================================================
# 11. PRINT FINAL SUMMARY
# ============================================================

print("\n" + "=" * 60)
print("FINAL MODEL EVALUATION")
print("=" * 60)

print(
    results_df.to_string(
        index=False
    )
)

print("\nGenerated files:")

print(
    f"1. {results_path}"
)

print(
    f"2. {comparison_path}"
)

print(
    f"3. {roc_path}"
)

print(
    f"4. {rf_cm_path}"
)

print(
    f"5. {all_cm_path}"
)

print("\n" + "=" * 60)
print("EVALUATION VISUALIZATION COMPLETED")
print("=" * 60)