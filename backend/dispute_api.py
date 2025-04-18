from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class Dispute(BaseModel):
    amount: float
    description: str
    timestamp: str

@router.post("/dispute")
def dispute_txn(dispute: Dispute):
    return { "status": "received", "message": "Dispute recorded" }