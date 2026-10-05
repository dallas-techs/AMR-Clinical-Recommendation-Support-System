from sqlalchemy.orm import Session

from app.models.recommendation import Recommendation
from app.models.clinical_record import ClinicalRecord
from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse
)


# ============================================================
# PARSE ANTIBIOTIC SUSCEPTIBILITY RESULTS
# ============================================================

def parse_antibiotic_results(antibiotic_results: str):

    susceptibility = {}

    if not antibiotic_results:
        return susceptibility

    entries = antibiotic_results.split(";")

    for entry in entries:

        entry = entry.strip()

        if not entry or ":" not in entry:
            continue

        antibiotic, status = entry.rsplit(":", 1)

        antibiotic = antibiotic.strip().upper()
        status = status.strip().upper()

        if status not in ["S", "I", "R"]:
            continue

        if antibiotic not in susceptibility:
            susceptibility[antibiotic] = set()

        susceptibility[antibiotic].add(status)

    return susceptibility


# ============================================================
# FORMAT SUSCEPTIBILITY FINDINGS
# ============================================================

def build_susceptibility_findings(susceptibility):

    susceptible = []
    intermediate = []
    resistant = []
    conflicting = []

    for antibiotic, statuses in sorted(
        susceptibility.items()
    ):

        if len(statuses) > 1:

            conflicting.append(
                f"{antibiotic} ({'/'.join(sorted(statuses))})"
            )

            continue

        status = next(iter(statuses))

        if status == "S":
            susceptible.append(antibiotic)

        elif status == "I":
            intermediate.append(antibiotic)

        elif status == "R":
            resistant.append(antibiotic)

    return (
        susceptible,
        intermediate,
        resistant,
        conflicting
    )


# ============================================================
# MAIN RECOMMENDATION ENGINE
# ============================================================

def get_recommendations(
    db: Session,
    data: RecommendationRequest,
    prediction_id: int
):

    # ---------------------------------------------------------
    # Get latest clinical record
    # ---------------------------------------------------------

    clinical_record = (
        db.query(ClinicalRecord)
        .filter(
            ClinicalRecord.patient_id
            == data.patient_id
        )
        .order_by(
            ClinicalRecord.id.desc()
        )
        .first()
    )

    # ---------------------------------------------------------
    # Read antibiotic susceptibility results
    # ---------------------------------------------------------

    antibiotic_results = ""

    if clinical_record:
        antibiotic_results = (
            clinical_record.antibiotic_results
            or ""
        )

    susceptibility = parse_antibiotic_results(
        antibiotic_results
    )

    (
        susceptible,
        intermediate,
        resistant,
        conflicting
    ) = build_susceptibility_findings(
        susceptibility
    )

    # ---------------------------------------------------------
    # Clinical action recommendations
    # ---------------------------------------------------------

    if data.prediction == "High AMR Risk":

        recommendations = [
            "Perform Culture & Sensitivity Test",
            "Avoid unnecessary antibiotic use",
            "Review reported antimicrobial susceptibility results",
            "Consider antimicrobial therapy only after clinical and microbiological assessment",
            "Consult Infectious Disease Specialist",
            "Monitor patient closely"
        ]

    else:

        recommendations = [
            "Review clinical and microbiological findings",
            "Use antibiotic therapy only when clinically indicated",
            "Monitor patient response",
            "Review laboratory values regularly"
        ]

    # ---------------------------------------------------------
    # Add susceptibility evidence
    # ---------------------------------------------------------

    if susceptible:

        recommendations.append(
            "Reported susceptible options: "
            + ", ".join(susceptible)
        )

    if intermediate:

        recommendations.append(
            "Reported intermediate results: "
            + ", ".join(intermediate)
        )

    if resistant:

        recommendations.append(
            "Reported resistant results: "
            + ", ".join(resistant)
        )

    if conflicting:

        recommendations.append(
            "Conflicting susceptibility results require "
            "clinical and microbiology review: "
            + ", ".join(conflicting)
        )

    # ---------------------------------------------------------
    # Prepare database recommendation
    # ---------------------------------------------------------

    if susceptible:

        recommended_antibiotic = (
            "Reported susceptible options: "
            + ", ".join(susceptible)
        )

    elif antibiotic_results:

        recommended_antibiotic = (
            "No single susceptible option identified"
        )

    else:

        recommended_antibiotic = (
            "No antibiotic susceptibility data available"
        )

    # ---------------------------------------------------------
    # Build detailed reason
    # ---------------------------------------------------------

    reason_parts = []

    for index, item in enumerate(
        recommendations,
        start=1
    ):

        reason_parts.append(
            f"{index}. {item}"
        )

    reason = " ".join(reason_parts)

    # ---------------------------------------------------------
    # Doctor safety note
    # ---------------------------------------------------------

    doctor_notes = (
        "Susceptibility findings are presented as clinical "
        "decision-support evidence. The system does not select "
        "or prescribe a specific antibiotic. Final antibiotic "
        "selection and treatment decision must be made by the "
        "treating clinician based on the complete clinical "
        "and microbiological assessment."
    )

    # ---------------------------------------------------------
    # Save recommendation to PostgreSQL
    # ---------------------------------------------------------

    db_recommendation = Recommendation(
        prediction_id=prediction_id,
        recommended_antibiotic=recommended_antibiotic,
        reason=reason,
        doctor_notes=doctor_notes
    )

    db.add(db_recommendation)

    db.commit()

    db.refresh(
        db_recommendation
    )

    # ---------------------------------------------------------
    # Return API response
    # ---------------------------------------------------------

    return RecommendationResponse(
        patient_id=data.patient_id,
        prediction=data.prediction,
        recommendations=recommendations
    )