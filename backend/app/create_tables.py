from app.database import Base, engine

# Import all models
from app.models.user import User
from app.models.patient import Patient
from app.models.clinical_record import ClinicalRecord
from app.models.prediction import Prediction
from app.models.recommendation import Recommendation

print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("✅ All database tables created successfully!")