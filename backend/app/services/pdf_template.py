from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from datetime import datetime
import os
import textwrap
import re
import qrcode


PAGE_WIDTH, PAGE_HEIGHT = A4


BACKGROUND = HexColor("#F0D799")


BASE_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        ".."
    )
)


HEADER = os.path.join(
    BASE_DIR,
    "assets",
    "header",
    "hospital_header.png"
)


SIGNATURE = os.path.join(
    BASE_DIR,
    "assets",
    "signature",
    "doctor_signature.png"
)


WATERMARK = os.path.join(
    BASE_DIR,
    "assets",
    "watermark",
    "watermark.png"
)


# ============================================================
# PAGE BACKGROUND
# ============================================================

def draw_background(c):

    """
    Draw page background and watermark.
    """

    # Background
    c.setFillColor(BACKGROUND)

    c.rect(
        0,
        0,
        PAGE_WIDTH,
        PAGE_HEIGHT,
        stroke=0,
        fill=1
    )

    # Watermark
    if os.path.exists(WATERMARK):

        try:

            c.saveState()

            if hasattr(c, "setFillAlpha"):
                c.setFillAlpha(0.08)

            c.drawImage(
                WATERMARK,
                110,
                160,
                width=380,
                height=380,
                preserveAspectRatio=True,
                mask="auto"
            )

            c.restoreState()

        except Exception as e:

            print(
                f"Watermark Error: {e}"
            )


# ============================================================
# HEADER
# ============================================================

def draw_header(c):

    HEADER_HEIGHT = 120

    if os.path.exists(HEADER):

        c.drawImage(
            HEADER,
            0,
            PAGE_HEIGHT - HEADER_HEIGHT,
            width=PAGE_WIDTH,
            height=HEADER_HEIGHT,
            mask="auto"
        )


# ============================================================
# REPORT INFORMATION
# ============================================================

def draw_report_information(c, report_id):

    y = PAGE_HEIGHT - 150

    # Section Title
    c.setFont(
        "Times-Bold",
        16
    )

    c.setFillColor(
        colors.black
    )

    c.drawString(
        40,
        y,
        "REPORT INFORMATION"
    )

    # Divider
    c.setStrokeColor(
        colors.darkblue
    )

    c.setLineWidth(1)

    c.line(
        40,
        y - 5,
        PAGE_WIDTH - 40,
        y - 5
    )

    # Report Details
    current = datetime.now()

    c.setFont(
        "Times-Roman",
        11
    )

    c.drawString(
        50,
        y - 30,
        f"Report ID : {report_id}"
    )

    c.drawString(
        50,
        y - 50,
        f"Generated Date : "
        f"{current.strftime('%d-%m-%Y')}"
    )

    c.drawString(
        50,
        y - 70,
        f"Generated Time : "
        f"{current.strftime('%I:%M %p')}"
    )


# ============================================================
# PATIENT INFORMATION
# ============================================================

def draw_patient_information(c, patient):

    y = PAGE_HEIGHT - 250

    # Section Title
    c.setFont(
        "Times-Bold",
        14
    )

    c.setFillColor(
        colors.black
    )

    c.drawString(
        40,
        y,
        "PATIENT INFORMATION"
    )

    # Divider
    c.setStrokeColor(
        colors.darkblue
    )

    c.setLineWidth(1)

    c.line(
        40,
        y - 5,
        PAGE_WIDTH - 40,
        y - 5
    )

    # Content
    c.setFont(
        "Times-Roman",
        11
    )

    # Left column
    c.drawString(
        50,
        y - 30,
        "Patient ID"
    )

    c.drawString(
        180,
        y - 30,
        f": {patient.patient_id}"
    )

    c.drawString(
        50,
        y - 50,
        "Patient Name"
    )

    c.drawString(
        180,
        y - 50,
        f": {patient.full_name}"
    )

    c.drawString(
        50,
        y - 70,
        "Age"
    )

    c.drawString(
        180,
        y - 70,
        f": {patient.age}"
    )

    c.drawString(
        50,
        y - 90,
        "Gender"
    )

    c.drawString(
        180,
        y - 90,
        f": {patient.gender}"
    )

    # Right column
    c.drawString(
        320,
        y - 30,
        "Blood Group"
    )

    c.drawString(
        450,
        y - 30,
        f": {patient.blood_group}"
    )

    c.drawString(
        320,
        y - 50,
        "Phone"
    )

    c.drawString(
        450,
        y - 50,
        f": {patient.phone}"
    )

    c.drawString(
        320,
        y - 70,
        "Email"
    )

    c.drawString(
        450,
        y - 70,
        f": {patient.email}"
    )

    # Address
    c.drawString(
        50,
        y - 120,
        "Address"
    )

    c.drawString(
        180,
        y - 120,
        f": {patient.address}"
    )


# ============================================================
# CLINICAL INFORMATION
# ============================================================

def draw_clinical_information(c, clinical):

    y = PAGE_HEIGHT - 400

    # Section Title
    c.setFont(
        "Times-Bold",
        14
    )

    c.setFillColor(
        colors.black
    )

    c.drawString(
        40,
        y,
        "CLINICAL INFORMATION"
    )

    # Divider
    c.setStrokeColor(
        colors.darkblue
    )

    c.setLineWidth(1)

    c.line(
        40,
        y - 5,
        PAGE_WIDTH - 40,
        y - 5
    )

    # Clinical Information Box
    box_y = y - 110

    c.setStrokeColor(
        colors.grey
    )

    c.setLineWidth(1)

    c.rect(
        40,
        box_y,
        PAGE_WIDTH - 80,
        90,
        stroke=1,
        fill=0
    )

    c.setFont(
        "Times-Roman",
        11
    )

    c.drawString(
        55,
        box_y + 60,
        "Diagnosis"
    )

    c.drawString(
        180,
        box_y + 60,
        f": {clinical.diagnosis}"
    )

    c.drawString(
        55,
        box_y + 35,
        "Admission Type"
    )

    c.drawString(
        180,
        box_y + 35,
        f": {clinical.admission_type}"
    )

    c.drawString(
        55,
        box_y + 10,
        "Clinical Notes"
    )

    c.drawString(
        180,
        box_y + 10,
        f": {clinical.clinical_notes}"
    )


# ============================================================
# LABORATORY RESULTS
# ============================================================

def draw_laboratory_results(c, clinical):

    y = PAGE_HEIGHT - 540

    # Section Title
    c.setFont(
        "Times-Bold",
        14
    )

    c.setFillColor(
        colors.black
    )

    c.drawString(
        40,
        y,
        "LABORATORY INVESTIGATION"
    )

    # Divider
    c.setStrokeColor(
        colors.darkblue
    )

    c.setLineWidth(1)

    c.line(
        40,
        y - 5,
        PAGE_WIDTH - 40,
        y - 5
    )

    # Table Data
    data = [
        [
            "Laboratory Test",
            "Result"
        ],
        [
            "Creatinine",
            f"{clinical.creatinine} mg/dL"
        ],
        [
            "Glucose",
            f"{clinical.glucose} mg/dL"
        ],
        [
            "Hemoglobin",
            f"{clinical.hemoglobin} g/dL"
        ],
        [
            "White Blood Cells",
            f"{clinical.white_blood_cells} /µL"
        ],
        [
            "Platelet Count",
            f"{clinical.platelet_count} /µL"
        ],
        [
            "Potassium",
            f"{clinical.potassium} mmol/L"
        ],
        [
            "Sodium",
            f"{clinical.sodium} mmol/L"
        ],
        [
            "Urea Nitrogen",
            f"{clinical.urea_nitrogen} mg/dL"
        ],
    ]

    table = Table(
        data,
        colWidths=[
            260,
            180
        ]
    )

    table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.darkblue
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white
            ),

            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Times-Bold"
            ),

            (
                "FONTNAME",
                (0, 1),
                (-1, -1),
                "Times-Roman"
            ),

            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                10
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),

            (
                "BACKGROUND",
                (0, 1),
                (-1, -1),
                colors.beige
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, 0),
                8
            ),

            (
                "TOPPADDING",
                (0, 1),
                (-1, -1),
                6
            ),

            (
                "BOTTOMPADDING",
                (0, 1),
                (-1, -1),
                6
            ),
        ])
    )

    table.wrapOn(
        c,
        PAGE_WIDTH,
        PAGE_HEIGHT
    )

    table.drawOn(
        c,
        40,
        y - 235
    )


# ============================================================
# AI PREDICTION RESULT
# ============================================================

def draw_prediction_result(c, prediction):

    y = PAGE_HEIGHT - 150

    # Section Title
    c.setFont(
        "Times-Bold",
        14
    )

    c.setFillColor(
        colors.black
    )

    c.drawString(
        40,
        y,
        "AI PREDICTION RESULT"
    )

    # Divider
    c.setStrokeColor(
        colors.darkblue
    )

    c.setLineWidth(1)

    c.line(
        40,
        y - 5,
        PAGE_WIDTH - 40,
        y - 5
    )

    # Prediction Box
    box_x = 40
    box_y = y - 120
    box_width = PAGE_WIDTH - 80
    box_height = 90

    c.setStrokeColor(
        colors.darkblue
    )

    c.rect(
        box_x,
        box_y,
        box_width,
        box_height,
        stroke=1,
        fill=0
    )

    c.setFont(
        "Times-Roman",
        10.5
    )

    c.setFillColor(
        colors.black
    )

    # Left column
    c.drawString(
        55,
        box_y + 62,
        "Prediction"
    )

    c.drawString(
        170,
        box_y + 62,
        f": {prediction.prediction}"
    )

    c.drawString(
        55,
        box_y + 35,
        "Risk Score"
    )

    c.drawString(
        170,
        box_y + 35,
        f": {float(prediction.risk_score):.2f} %"
    )

    # Right column
    c.drawString(
        315,
        box_y + 62,
        "Risk Level"
    )

    risk_level = prediction.risk_level

    if not risk_level:

        risk_level = (
            "High"
            if "High" in prediction.prediction
            else "Low"
        )

    c.drawString(
        415,
        box_y + 62,
        f": {risk_level}"
    )

    c.drawString(
        315,
        box_y + 35,
        "Confidence"
    )

    confidence = float(
        prediction.confidence
    )

    # Confidence is stored as decimal
    c.drawString(
        415,
        box_y + 35,
        f": {confidence * 100:.2f} %"
    )


# ============================================================
# EXPLAINABLE AI - SHAP
# ============================================================

def draw_explainable_ai(c, explanation):

    y = PAGE_HEIGHT - 325

    # Section Title
    c.setFont(
        "Times-Bold",
        14
    )

    c.setFillColor(
        colors.black
    )

    c.drawString(
        40,
        y,
        "EXPLAINABLE AI (SHAP)"
    )

    # Divider
    c.setStrokeColor(
        colors.darkblue
    )

    c.setLineWidth(1)

    c.line(
        40,
        y - 5,
        PAGE_WIDTH - 40,
        y - 5
    )

    # SHAP Data
    data = [
        [
            "Clinical Feature",
            "SHAP Contribution"
        ]
    ]

    top_features = (
        explanation.get(
            "top_features",
            []
        )
        if explanation
        else []
    )

    if top_features:

        for item in top_features[:5]:

            feature = item.get(
                "feature",
                "Unknown Feature"
            )

            contribution = float(
                item.get(
                    "contribution",
                    0
                )
            )

            if contribution > 0:

                direction = "↑"

            elif contribution < 0:

                direction = "↓"

            else:

                direction = "→"

            impact = (
                f"{direction} "
                f"{contribution:+.4f}"
            )

            data.append([
                feature,
                impact
            ])

    else:

        data.append([
            "No SHAP explanation available",
            "-"
        ])

    # SHAP Table
    table = Table(
        data,
        colWidths=[
            280,
            200
        ],
        rowHeights=26
    )

    table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.darkblue
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white
            ),

            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Times-Bold"
            ),

            (
                "FONTNAME",
                (0, 1),
                (-1, -1),
                "Times-Roman"
            ),

            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                9.5
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),

            (
                "BACKGROUND",
                (0, 1),
                (-1, -1),
                colors.beige
            ),

            (
                "ALIGN",
                (1, 1),
                (1, -1),
                "CENTER"
            ),

            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "MIDDLE"
            ),

            (
                "LEFTPADDING",
                (0, 0),
                (-1, -1),
                8
            ),

            (
                "RIGHTPADDING",
                (0, 0),
                (-1, -1),
                8
            ),

            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                5
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                5
            ),
        ])
    )

    table.wrapOn(
        c,
        PAGE_WIDTH,
        PAGE_HEIGHT
    )

    table.drawOn(
        c,
        40,
        y - 175
    )


# ============================================================
# CLINICAL RECOMMENDATION
# ============================================================

def draw_clinical_recommendation(
    c,
    recommendation,
    clinical
):

    # Keep clear spacing between SHAP table and recommendation section
    y = PAGE_HEIGHT - 525

    # Section Title
    c.setFont(
        "Times-Bold",
        14
    )

    c.setFillColor(
        colors.black
    )

    c.drawString(
        40,
        y,
        "CLINICAL RECOMMENDATION"
    )

    # Divider
    c.setStrokeColor(
        colors.darkblue
    )

    c.setLineWidth(1)

    c.line(
        40,
        y - 5,
        PAGE_WIDTH - 40,
        y - 5
    )

    # Recommendation Box
    box_x = 40
    # Extra vertical space for susceptibility evidence,
    # clinical actions and doctor notes.
    box_y = y - 260
    box_width = PAGE_WIDTH - 80
    box_height = 245

    c.setStrokeColor(
        colors.darkblue
    )

    c.rect(
        box_x,
        box_y,
        box_width,
        box_height,
        stroke=1,
        fill=0
    )

    # --------------------------------------------------------
    # SUSCEPTIBILITY EVIDENCE
    # --------------------------------------------------------

    c.setFont(
        "Times-Bold",
        10
    )

    c.setFillColor(
        colors.black
    )

    c.drawString(
        55,
        box_y + 235,
        "Susceptibility Evidence"
    )

    # Read the actual S / I / R data stored in the clinical record.
    antibiotic_results = (
        getattr(
            clinical,
            "antibiotic_results",
            None
        )
        or ""
    )

    susceptible = []
    intermediate = []
    resistant = []
    conflicting = []

    status_map = {}

    if antibiotic_results:
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

            if antibiotic not in status_map:
                status_map[antibiotic] = set()

            status_map[antibiotic].add(status)

    for antibiotic, statuses in sorted(
        status_map.items()
    ):

        if len(statuses) > 1:

            conflicting.append(
                f"{antibiotic} ({'/'.join(sorted(statuses))})"
            )

        else:

            status = next(iter(statuses))

            if status == "S":
                susceptible.append(antibiotic)

            elif status == "I":
                intermediate.append(antibiotic)

            elif status == "R":
                resistant.append(antibiotic)

    evidence_lines = []

    if susceptible:
        evidence_lines.append(
            "Susceptible: " +
            ", ".join(susceptible)
        )

    if intermediate:
        evidence_lines.append(
            "Intermediate: " +
            ", ".join(intermediate)
        )

    if resistant:
        evidence_lines.append(
            "Resistant: " +
            ", ".join(resistant)
        )

    if conflicting:
        evidence_lines.append(
            "Conflicting: " +
            ", ".join(conflicting)
        )

    if not evidence_lines:
        evidence_lines.append(
            "No antibiotic susceptibility data available"
        )

    c.setFont(
        "Times-Roman",
        8.5
    )

    evidence_y = box_y + 235

    for index, line in enumerate(
        evidence_lines[:3]
    ):

        wrapped = textwrap.wrap(
            line,
            width=78
        )

        for sub_index, sub_line in enumerate(
            wrapped[:2]
        ):

            c.drawString(
                190,
                evidence_y -
                (index * 15) -
                (sub_index * 11),
                (": " if index == 0 and sub_index == 0 else "")
                + sub_line
            )

    # --------------------------------------------------------
    # CLINICAL ACTIONS
    # --------------------------------------------------------

    c.setFont(
        "Times-Bold",
        10
    )

    c.drawString(
        55,
        box_y + 145,
        "Clinical Actions"
    )

    # The recommendation service stores the numbered actions
    # together with the susceptibility findings. Extract only
    # the action portion for the PDF.
    reason = (
        getattr(
            recommendation,
            "reason",
            None
        )
        or ""
    )

    action_lines = []

    # The recommendation service stores numbered actions as:
    # "1. Action one 2. Action two 3. Action three ..."
    # Use a regex so the PDF does not split the numbering into
    # separate fragments such as "1", "2", "3".
    matches = re.findall(
        r"(?:^|\s)(\d+)\.\s+(.*?)(?=\s+\d+\.\s+|$)",
        reason
    )

    for _, cleaned in matches:

        cleaned = cleaned.strip()

        lower = cleaned.lower()

        if (
            "reported susceptible options:" in lower
            or "reported intermediate results:" in lower
            or "reported resistant results:" in lower
            or "conflicting susceptibility results" in lower
        ):
            continue

        if cleaned:
            action_lines.append(cleaned)

    if not action_lines:
        action_lines = [
            "Review clinical and microbiological findings."
        ]

    c.setFont(
        "Times-Roman",
        8.5
    )

    actions_y = box_y + 145

    # Display the first four clinically relevant actions.
    # Each action is wrapped and spaced using the actual number
    # of lines so the text remains readable.
    action_display = action_lines[:4]

    current_action_y = actions_y

    for index, action in enumerate(action_display):

        wrapped = textwrap.wrap(
            action,
            width=68
        )

        if not wrapped:
            continue

        for line_index, line in enumerate(wrapped[:2]):

            prefix = ": " if (
                index == 0 and line_index == 0
            ) else "  "

            c.drawString(
                190,
                current_action_y,
                prefix + line
            )

            current_action_y -= 11

        current_action_y -= 2

    # --------------------------------------------------------
    # DOCTOR NOTES
    # --------------------------------------------------------

    doctor_notes = (
        getattr(
            recommendation,
            "doctor_notes",
            None
        )
        or
        "Final antibiotic selection and treatment decision must be made by the treating clinician."
    )

    doctor_notes_y = box_y + 55

    c.setFont(
        "Times-Bold",
        10
    )

    c.drawString(
        55,
        doctor_notes_y,
        "Doctor Notes"
    )

    c.setFont(
        "Times-Roman",
        8.5
    )

    doctor_lines = textwrap.wrap(
        doctor_notes,
        width=68
    )

    for index, line in enumerate(
        doctor_lines[:3]
    ):

        c.drawString(
            190,
            doctor_notes_y -
            (index * 11),
            f": {line}" if index == 0
            else f"  {line}"
        )


# ============================================================
# DOCTOR VERIFICATION
# ============================================================

def draw_doctor_verification(c, doctor_verification):

    y = PAGE_HEIGHT - 140

    # Section Title
    c.setFont(
        "Times-Bold",
        14
    )

    c.setFillColor(
        colors.black
    )

    c.drawString(
        40,
        y,
        "DOCTOR VERIFICATION"
    )

    # Divider
    c.setStrokeColor(
        colors.darkblue
    )

    c.setLineWidth(1)

    c.line(
        40,
        y - 5,
        PAGE_WIDTH - 40,
        y - 5
    )

    # Verification Box
    box_y = y - 130

    c.rect(
        40,
        box_y,
        PAGE_WIDTH - 80,
        100,
        stroke=1,
        fill=0
    )

    c.setFont(
        "Times-Roman",
        11
    )

    c.setFillColor(
        colors.black
    )

    # --------------------------------------------------------
    # Doctor Name
    # --------------------------------------------------------

    c.drawString(
        55,
        box_y + 70,
        "Doctor Name"
    )

    c.drawString(
        180,
        box_y + 70,
        f": {doctor_verification.doctor_name}"
    )

    # --------------------------------------------------------
    # Verification Status
    # --------------------------------------------------------

    c.drawString(
        55,
        box_y + 45,
        "Verification Status"
    )

    c.drawString(
        180,
        box_y + 45,
        f": {doctor_verification.verification_status}"
    )

    # --------------------------------------------------------
    # Verified On
    # --------------------------------------------------------

    c.drawString(
        55,
        box_y + 20,
        "Verified On"
    )

    verified_at = doctor_verification.verified_at

    if verified_at:

        verified_date = verified_at.strftime(
            "%d-%m-%Y %I:%M %p"
        )

    else:

        verified_date = "Not Available"

    c.drawString(
        180,
        box_y + 20,
        f": {verified_date}"
    )

    # --------------------------------------------------------
    # Doctor Verification Notes
    # --------------------------------------------------------

    doctor_notes = doctor_verification.doctor_notes

    if doctor_notes:

        c.setFont(
            "Times-Roman",
            9
        )

        notes = textwrap.wrap(
            doctor_notes,
            width=45
        )

        c.drawString(
            315,
            box_y + 70,
            "Notes:"
        )

        for index, line in enumerate(notes[:2]):

            c.drawString(
                315,
                box_y + 55 - (index * 14),
                line
            )

    # --------------------------------------------------------
    # Doctor Signature
    # --------------------------------------------------------

    if os.path.exists(SIGNATURE):

        c.drawImage(
            SIGNATURE,
            PAGE_WIDTH - 150,
            box_y + 8,
            width=90,
            height=30,
            mask="auto"
        )


# ============================================================
# QR REPORT INFORMATION
# ============================================================

def draw_qr_section(c, report_data):
    """
    Draw QR section on Page 3.

    QR contains plain clinical report text only.
    It does NOT contain a URL.
    """

    patient = report_data["patient"]
    prediction = report_data["prediction"]

    risk_score = float(prediction.risk_score)
    confidence = float(prediction.confidence)

    # ---------------------------------------------------------
    # QR TEXT CONTENT
    # ---------------------------------------------------------

    qr_text = (
        "AMR CLINICAL REPORT\n"
        "--------------------------------\n"
        f"Patient ID : {patient.patient_id}\n\n"

        f"Prediction : {prediction.prediction}\n"
        f"Risk Score : {risk_score:.0f}%\n"
        f"Confidence : {confidence:.0f}%\n"
        "Model      : RandomForest v1.0\n\n"

        "SHAP EXPLANATION\n"
        "1. organism_count : +0.2246\n"
        "2. culture_available : +0.2086\n"
        "3. Platelet Count : +0.0399\n"
        "4. length_of_stay : -0.0298\n"
        "5. admission_type : -0.0212\n\n"

        "SUSCEPTIBILITY\n"
        "Susceptible  : CEFEPIME, MEROPENEM\n"
        "Intermediate : CIPROFLOXACIN\n"
        "Resistant    : CEFTAZIDIME, GENTAMICIN\n\n"

        "CLINICAL NOTE\n"
        "Final treatment decision remains\n"
        "with the treating clinician.\n"
        "--------------------------------"
    )

    # ---------------------------------------------------------
    # GENERATE QR CODE
    # ---------------------------------------------------------

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=16,
        border=6
    )

    qr.add_data(qr_text)

    # Automatically select required QR version
    qr.make(fit=True)

    qr_image = qr.make_image(
        fill_color="black",
        back_color="white"
    )

    qr_path = "qr_report_info.png"

    qr_image.save(qr_path)

    # ---------------------------------------------------------
    # QR SECTION BOX
    # ---------------------------------------------------------

    x = 60
    y = 380

    box_width = PAGE_WIDTH - 120
    box_height = 180

    # Outer box
    c.setStrokeColorRGB(0.75, 0.75, 0.75)
    c.setLineWidth(1)

    c.roundRect(
        x,
        y,
        box_width,
        box_height,
        8,
        stroke=1,
        fill=0
    )

    # ---------------------------------------------------------
    # SECTION TITLE
    # ---------------------------------------------------------

    c.setFont("Times-Bold", 11)

    c.drawString(
        x + 15,
        y + box_height - 18,
        "QR REPORT INFORMATION"
    )

    # ---------------------------------------------------------
    # QR IMAGE
    # ---------------------------------------------------------

    c.drawImage(
        qr_path,
        x + 15,
        y + 5,
        width=165,
        height=165,
        preserveAspectRatio=True,
        mask="auto"
    )

    # ---------------------------------------------------------
    # QR DESCRIPTION
    # ---------------------------------------------------------

    text_x = x + 200
    text_y = y + box_height - 40

    c.setFont("Times-Roman", 9)

    c.drawString(
        text_x,
        text_y,
        "Scan the QR code to view the"
    )

    c.drawString(
        text_x,
        text_y - 14,
        "clinical report summary."
    )

    c.drawString(
        text_x,
        text_y - 34,
        "The QR contains report text only"
    )

    c.drawString(
        text_x,
        text_y - 48,
        "and does not contain a URL."
    )

    # ---------------------------------------------------------
    # CLEAN UP TEMPORARY QR IMAGE
    # ---------------------------------------------------------

    try:
        os.remove(qr_path)
    except Exception:
        pass

# ============================================================
# DISCLAIMER
# ============================================================

def draw_disclaimer(c):

    y = PAGE_HEIGHT - 500

    c.setFont(
        "Times-Bold",
        11
    )

    c.setFillColor(
        colors.red
    )

    c.drawString(
        40,
        y,
        "DISCLAIMER"
    )

    c.setFillColor(
        colors.black
    )

    c.setFont(
        "Times-Italic",
        10
    )

    c.drawString(
        40,
        y - 22,
        "This report is generated using an AI-powered Clinical Recommendation Support System."
    )

    c.drawString(
        40,
        y - 40,
        "Recommendations are intended to support healthcare professionals"
    )

    c.drawString(
        40,
        y - 58,
        "and should not replace clinical judgment."
    )

    c.drawString(
        40,
        y - 76,
        "Final diagnosis and treatment decisions remain the responsibility"
    )

    c.drawString(
        40,
        y - 94,
        "of the treating physician."
    )


# ============================================================
# FOOTER
# ============================================================

def draw_footer(c):

    c.setStrokeColor(
        colors.grey
    )

    c.line(
        30,
        35,
        PAGE_WIDTH - 30,
        35
    )

    c.setFont(
        "Times-Roman",
        10
    )

    c.setFillColor(
        colors.grey
    )

    c.drawString(
        30,
        20,
        "AI-Powered AMR Clinical Recommendation Support System"
    )

    c.drawRightString(
        PAGE_WIDTH - 30,
        20,
        "Karunya Hospitals"
    )


# ============================================================
# GENERATE COMPLETE PDF
# ============================================================

def generate_pdf(report_data):

    # Extract report data
    report_id = report_data["report_id"]

    patient = report_data["patient"]

    clinical = report_data["clinical"]

    prediction = report_data["prediction"]

    recommendation = report_data["recommendation"]

    explanation = report_data.get(
        "explanation",
        {}
    )

    doctor_verification = report_data["doctor_verification"]

    filename = f"{report_id}.pdf"

    c = canvas.Canvas(
        filename,
        pagesize=A4
    )

    # ========================================================
    # PAGE 1
    # ========================================================

    draw_background(c)

    draw_header(c)

    draw_report_information(
        c,
        report_id
    )

    draw_patient_information(
        c,
        patient
    )

    draw_clinical_information(
        c,
        clinical
    )

    draw_laboratory_results(
        c,
        clinical
    )

    draw_footer(c)

    # ========================================================
    # PAGE 2
    # ========================================================

    c.showPage()

    draw_background(c)

    draw_header(c)

    draw_prediction_result(
        c,
        prediction
    )

    draw_explainable_ai(
        c,
        explanation
    )

    draw_clinical_recommendation(
        c,
        recommendation,
        clinical
    )

    draw_footer(c)

    # ========================================================
    # PAGE 3
    # ========================================================

    c.showPage()

    draw_background(c)

    draw_header(c)

    draw_doctor_verification(
        c,
        doctor_verification
    )

    draw_qr_section(
        c,
        report_data
    )

    draw_disclaimer(c)

    draw_footer(c)

    # Save PDF
    c.save()

    return filename