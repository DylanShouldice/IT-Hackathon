from pydantic import BaseModel

class PatientResponse(BaseModel):
    id: int
    first_name: str
    last_name: str

    class Config:
        orm_mode = True  # This tells Pydantic to convert from SQLAlchemy models
