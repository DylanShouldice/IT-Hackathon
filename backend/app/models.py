from sqlalchemy import Column, Integer, String
from app.database import Base

class Consultation(Base):
    __tablename__ = "consultation"
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, index=True)
    patient_id = Column(Integer, index=True)

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)

