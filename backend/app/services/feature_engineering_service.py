# ============================================================
# AMR Feature Engineering Service
# ============================================================

from typing import Dict


# ============================================================
# AGE GROUP
# ============================================================

def calculate_age_group(age: int) -> str:
    """
    Convert patient age into the age-group categories
    supported by the trained AMR prediction model.

    Model-supported categories:
    Young Adult -> 2
    Adult       -> 0
    Elderly     -> 1

    The current trained model does not contain a separate
    Child category. Therefore, ages below 18 are mapped to
    the supported Young Adult category to avoid generating
    an unseen categorical value during prediction.
    """

    if age is None:
        raise ValueError(
            "Age is required for age-group feature engineering."
        )

    age = int(age)

    # --------------------------------------------------------
    # Model-supported age categories
    # --------------------------------------------------------

    if age <= 39:
        return "Young Adult"

    elif age <= 64:
        return "Adult"

    else:
        return "Elderly"


# ============================================================
# LENGTH OF STAY CATEGORY
# ============================================================

def calculate_los_category(days: float) -> str:
    """
    Convert length of stay into the same categories
    used during AMR dataset feature engineering.
    """

    if days is None:
        raise ValueError(
            "Length of stay is required for feature engineering."
        )

    days = float(days)

    if days <= 3:
        return "Short"

    elif days <= 7:
        return "Medium"

    else:
        return "Long"


# ============================================================
# DIAGNOSIS COUNT
# ============================================================

def calculate_diagnosis_count(diagnoses: str) -> int:
    """
    Count diagnoses separated by semicolon (;).

    Example:
    Pneumonia;Diabetes
    -> 2
    """

    if not diagnoses:
        return 0

    diagnoses = str(diagnoses).strip()

    if diagnoses == "":
        return 0

    return len(diagnoses.split(";"))


# ============================================================
# DRUG COUNT
# ============================================================

def calculate_drug_count(drugs: str) -> int:
    """
    Count drugs separated by semicolon (;).

    No_Drug -> 0
    """

    if not drugs:
        return 0

    drugs = str(drugs).strip()

    if drugs == "" or drugs == "No_Drug":
        return 0

    return len(drugs.split(";"))


# ============================================================
# CULTURE AVAILABLE
# ============================================================

def calculate_culture_available(org_name: str) -> int:
    """
    Determine whether culture information is available.

    No_Culture -> 0
    Otherwise -> 1
    """

    if not org_name:
        return 0

    return (
        0
        if str(org_name).strip() == "No_Culture"
        else 1
    )


# ============================================================
# ORGANISM COUNT
# ============================================================

def calculate_organism_count(org_name: str) -> int:
    """
    Count organisms separated by semicolon (;).

    No_Culture -> 0
    """

    if not org_name:
        return 0

    org_name = str(org_name).strip()

    if org_name == "" or org_name == "No_Culture":
        return 0

    return len(org_name.split(";"))


# ============================================================
# BROAD-SPECTRUM ANTIBIOTIC DETECTION
# ============================================================

BROAD_SPECTRUM_DRUGS = [
    "Meropenem",
    "Imipenem",
    "Piperacillin",
    "Tazobactam",
    "Cefepime",
    "Vancomycin",
    "Linezolid",
    "Colistin",
]


def calculate_broad_spectrum_used(drugs: str) -> int:
    """
    Determine whether any configured broad-spectrum
    antibiotic is present in the drug list.

    Returns:
    1 -> broad-spectrum drug detected
    0 -> not detected
    """

    if not drugs:
        return 0

    drugs_lower = str(drugs).lower()

    for drug in BROAD_SPECTRUM_DRUGS:

        if drug.lower() in drugs_lower:
            return 1

    return 0


# ============================================================
# PRIOR ANTIBIOTIC EXPOSURE
# ============================================================

def calculate_prior_antibiotic_exposure(
    drugs: str
) -> int:
    """
    Determine whether the patient has recorded
    antibiotic/drug exposure.

    No_Drug -> 0
    Otherwise -> 1
    """

    if not drugs:
        return 0

    return (
        0
        if str(drugs).strip() == "No_Drug"
        else 1
    )


# ============================================================
# COMPLETE FEATURE ENGINEERING
# ============================================================

def generate_engineered_features(
    age: int,
    length_of_stay: float,
    diagnoses: str,
    drugs: str,
    org_name: str,
) -> Dict:
    """
    Generate all engineered clinical features required
    by the AMR prediction model.
    """

    # --------------------------------------------------------
    # Age group
    # --------------------------------------------------------

    age_group = calculate_age_group(age)

    # --------------------------------------------------------
    # Length of stay
    # --------------------------------------------------------

    los_category = calculate_los_category(
        length_of_stay
    )

    # --------------------------------------------------------
    # Diagnosis count
    # --------------------------------------------------------

    diagnosis_count = calculate_diagnosis_count(
        diagnoses
    )

    # --------------------------------------------------------
    # Drug count
    # --------------------------------------------------------

    drug_count = calculate_drug_count(
        drugs
    )

    # --------------------------------------------------------
    # Culture availability
    # --------------------------------------------------------

    culture_available = calculate_culture_available(
        org_name
    )

    # --------------------------------------------------------
    # Organism count
    # --------------------------------------------------------

    organism_count = calculate_organism_count(
        org_name
    )

    # --------------------------------------------------------
    # Broad-spectrum antibiotic usage
    # --------------------------------------------------------

    broad_spectrum_used = (
        calculate_broad_spectrum_used(
            drugs
        )
    )

    # --------------------------------------------------------
    # Prior antibiotic exposure
    # --------------------------------------------------------

    prior_antibiotic_exposure = (
        calculate_prior_antibiotic_exposure(
            drugs
        )
    )

    # --------------------------------------------------------
    # Return all engineered features
    # --------------------------------------------------------

    return {

        "age_group":
            age_group,

        "los_category":
            los_category,

        "diagnosis_count":
            diagnosis_count,

        "drug_count":
            drug_count,

        "culture_available":
            culture_available,

        "organism_count":
            organism_count,

        "broad_spectrum_used":
            broad_spectrum_used,

        "prior_antibiotic_exposure":
            prior_antibiotic_exposure,
    }