from fastapi import APIRouter
from uuid import uuid4

router = APIRouter()

@router.post("/link-bank")
def link_bank():
    return {
        "account_id": str(uuid4()),
        "name": "Mock Bank of FIN"
    }