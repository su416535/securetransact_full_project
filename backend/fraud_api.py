from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import numpy as np

router = APIRouter()

model = joblib.load("fraud_model.pkl")

class Txn(BaseModel):
    amount: float
    hour: int
    location_diff: int
    is_foreign: int
    is_high_risk_merchant: int

@router.post("/predict-fraud")
def predict(txn: Txn):
    features = np.array([[txn.amount, txn.hour, txn.location_diff, txn.is_foreign, txn.is_high_risk_merchant]])
    pred = model.predict(features)[0]
    return {"fraud": bool(pred)}