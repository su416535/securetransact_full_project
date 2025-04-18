from fastapi import APIRouter
import random
from datetime import datetime
import joblib
import numpy as np

router = APIRouter()

# Load model (same as fraud_api)
model = joblib.load("fraud_model.pkl")

descriptions = ["Food", "Travel", "Bills", "Shopping", "Gaming", "Crypto Transfer", "Gift Card", "ATM Withdrawal"]
transactions = []

def predict_fraud(amount, hour, location_diff, is_foreign, is_high_risk_merchant):
    features = np.array([[amount, hour, location_diff, is_foreign, is_high_risk_merchant]])
    pred = model.predict(features)[0]
    return bool(pred)

@router.get("/mock-transactions")
def mock_txns():
    if len(transactions) < 20:
        hour = datetime.now().hour
        amount = round(random.uniform(10, 3000), 2)
        location_diff = random.choice([0, 1])
        is_foreign = random.choice([0, 1])
        is_high_risk_merchant = random.choice([0, 1])
        description = random.choice(descriptions)

        fraud = predict_fraud(amount, hour, location_diff, is_foreign, is_high_risk_merchant)

        new_txn = {
            "amount": amount,
            "hour": hour,
            "location_diff": location_diff,
            "is_foreign": is_foreign,
            "is_high_risk_merchant": is_high_risk_merchant,
            "description": description,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "fraud": fraud
        }
        transactions.append(new_txn)
    return transactions
