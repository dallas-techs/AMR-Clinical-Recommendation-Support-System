# ==========================================
# AMR Model Training & Evaluation
# ==========================================

import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split

# Models
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

# Evaluation Metrics
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)


# ==========================================
# LOAD DATASET
# ==========================================

dataset_path = "../../dataset/final/preprocessed_amr_dataset.csv"

df = pd.read_csv(dataset_path)

print("=" * 60)
print("AMR MODEL TRAINING & EVALUATION")
print("=" * 60)

print("\nDataset Loaded Successfully")
print("Dataset Shape :", df.shape)


# ==========================================
# FEATURES & TARGET
# ==========================================

X = df.drop("amr_label", axis=1)
y = df["amr_label"]

print("\nFeature Matrix Shape :", X.shape)
print("Target Distribution:")
print(y.value_counts())


# ==========================================
# TRAIN-TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\n" + "=" * 60)
print("TRAIN / TEST SPLIT")
print("=" * 60)

print("Training Samples :", len(X_train))
print("Testing Samples  :", len(X_test))


# ==========================================
# MODELS
# ==========================================

models = {

    "Logistic Regression":
        LogisticRegression(max_iter=2000),

    "Decision Tree":
        DecisionTreeClassifier(
            random_state=42
        ),

    "Random Forest":
        RandomForestClassifier(
            random_state=42
        )
}


# ==========================================
# TRAINING
# ==========================================

trained_models = {}

results = []


for name, model in models.items():

    print("\n" + "=" * 60)
    print(f"Training {name}")
    print("=" * 60)

    model.fit(X_train, y_train)

    trained_models[name] = model

    # --------------------------------------
    # Predictions
    # --------------------------------------

    y_pred = model.predict(X_test)

    # --------------------------------------
    # Probability for ROC-AUC
    # --------------------------------------

    if hasattr(model, "predict_proba"):

        y_probability = model.predict_proba(
            X_test
        )[:, 1]

    else:

        y_probability = None


    # --------------------------------------
    # Evaluation Metrics
    # --------------------------------------

    accuracy = accuracy_score(
        y_test,
        y_pred
    )

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

    if y_probability is not None:

        roc_auc = roc_auc_score(
            y_test,
            y_probability
        )

    else:

        roc_auc = 0.0


    # --------------------------------------
    # Confusion Matrix
    # --------------------------------------

    cm = confusion_matrix(
        y_test,
        y_pred
    )


    # --------------------------------------
    # Store Results
    # --------------------------------------

    results.append({

        "Model": name,

        "Accuracy": round(
            accuracy, 4
        ),

        "Precision": round(
            precision, 4
        ),

        "Recall": round(
            recall, 4
        ),

        "F1-Score": round(
            f1, 4
        ),

        "ROC-AUC": round(
            roc_auc, 4
        )
    })


    # --------------------------------------
    # Print Results
    # --------------------------------------

    print("\nAccuracy  :", round(
        accuracy, 4
    ))

    print("Precision :", round(
        precision, 4
    ))

    print("Recall    :", round(
        recall, 4
    ))

    print("F1-Score  :", round(
        f1, 4
    ))

    print("ROC-AUC   :", round(
        roc_auc, 4
    ))

    print("\nConfusion Matrix:")
    print(cm)

    print("\nClassification Report:")
    print(
        classification_report(
            y_test,
            y_pred,
            zero_division=0
        )
    )


# ==========================================
# MODEL COMPARISON
# ==========================================

results_df = pd.DataFrame(results)

print("\n" + "=" * 60)
print("MODEL COMPARISON")
print("=" * 60)

print(
    results_df.to_string(
        index=False
    )
)


# ==========================================
# SAVE EVALUATION RESULTS
# ==========================================

evaluation_path = (
    "../../dataset/final/"
    "model_evaluation_results.csv"
)

results_df.to_csv(
    evaluation_path,
    index=False
)

print(
    "\nEvaluation results saved to:"
)

print(evaluation_path)


# ==========================================
# SAVE RANDOM FOREST MODEL
# ==========================================

model_directory = "models"

os.makedirs(
    model_directory,
    exist_ok=True
)

random_forest_path = (
    "models/amr_model.pkl"
)

joblib.dump(
    trained_models["Random Forest"],
    random_forest_path
)

print(
    "\nRandom Forest model saved successfully!"
)

print(
    "Model path:",
    random_forest_path
)


# ==========================================
# COMPLETION
# ==========================================

print("\n" + "=" * 60)
print("TRAINING & EVALUATION COMPLETED")
print("=" * 60)