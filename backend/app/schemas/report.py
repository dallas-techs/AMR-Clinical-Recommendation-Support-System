from pydantic import BaseModel

class ReportRequest(BaseModel):
    patient_id: int