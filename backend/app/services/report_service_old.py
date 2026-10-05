from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

from app.schemas.report import ReportRequest


def generate_report(data: ReportRequest):

    filename = "amr_report.pdf"

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    story = []

    story.append(Paragraph("<b>AMR Clinical Recommendation Report</b>", styles["Title"]))

    story.append(Paragraph(f"<b>Patient Name:</b> {data.patient_name}", styles["BodyText"]))
    story.append(Paragraph(f"<b>Age:</b> {data.age}", styles["BodyText"]))
    story.append(Paragraph(f"<b>Gender:</b> {data.gender}", styles["BodyText"]))

    story.append(Paragraph("<br/>", styles["BodyText"]))

    story.append(Paragraph(f"<b>Prediction:</b> {data.prediction}", styles["BodyText"]))
    story.append(Paragraph(f"<b>Risk Score:</b> {data.risk_score}%", styles["BodyText"]))

    story.append(Paragraph("<br/><b>Top SHAP Features</b>", styles["Heading2"]))

    for feature in data.top_features:
        story.append(Paragraph(f"• {feature}", styles["BodyText"]))

    story.append(Paragraph("<br/><b>Clinical Recommendations</b>", styles["Heading2"]))

    for recommendation in data.recommendations:
        story.append(Paragraph(f"• {recommendation}", styles["BodyText"]))

    doc.build(story)

    return {
        "message": "Report Generated Successfully",
        "file": filename
    }