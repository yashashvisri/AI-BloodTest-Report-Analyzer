from sqlalchemy import Column, Integer, String
from app.database.models import Base


class BloodReport(Base):
    __tablename__ = "blood_reports"

    id = Column(Integer, primary_key=True, index=True)

    patient_name = Column(String)

    original_filename = Column(String)

    stored_filename = Column(String)

    file_path = Column(String)