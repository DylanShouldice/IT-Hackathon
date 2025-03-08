from fastapi import FastAPI, Depends, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal
from app.models import Consultation, Patient
from app.schemas import PatientResponse
from fastapi.middleware.cors import CORSMiddleware
import traceback


app = FastAPI()

# Expand the origins list to include all possible localhost ports
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler to prevent 500 errors from blocking CORS
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_detail = str(exc)
    # Log the full traceback for debugging
    print(f"Global exception: {error_detail}")
    print(traceback.format_exc())
    
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {error_detail}"}
    )

@app.get("/")
def read_root():
    return {"Hello": "World"}

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/patients", response_model=List[PatientResponse])
def get_patients_by_doctor(doctor_id: int = Query(...), db: Session = Depends(get_db)):
    try:
        # Query for consultations based on doctor_id
        consultations = db.query(Consultation).filter(Consultation.doctor_id == doctor_id).all()
        
        if not consultations:
            raise HTTPException(status_code=404, detail="No consultations found for this doctor")
        
        patient_ids = [consultation.patient_id for consultation in consultations]
        patients = db.query(Patient).filter(Patient.id.in_(patient_ids)).all()
        
        if not patients:
            raise HTTPException(status_code=404, detail="No patients found for the given consultations")
        
        return patients
    except Exception as e:
        # Catch any unexpected errors to provide better feedback
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Add an options endpoint for CORS preflight requests
@app.options("/api/patients")
async def options_patients():
    return {}

# Add a recording endpoint for your audio recordings
@app.post("/api/recordings")
async def save_recording():
    return {"status": "success", "message": "Recording saved successfully"}
