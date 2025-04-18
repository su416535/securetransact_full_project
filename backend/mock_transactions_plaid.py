from fastapi import APIRouter, Request
from plaid2.client import PlaidClient
from dotenv import load_dotenv
import os
from datetime import datetime

router = APIRouter()

load_dotenv()
plaid_client =  PlaidClient.from_env()  # Uses PLAID_CLIENT_ID, PLAID_SECRET, etc.

user_transactions = {}
user_access_tokens = {}

@router.get("/mock-transactions")
def get_transactions(request: Request, user_id: str = "guest"):
    access_token = user_access_tokens.get(user_id) or os.getenv("PLAID_SANDBOX_ACCESS_TOKEN")
    if not access_token:
        return [{"error": "Access token not found for user."}]

    if user_id in user_transactions:
        return user_transactions[user_id]

    try:
        response = plaid_client.transactions_get(
            access_token,
            start_date="2025-01-01",
            end_date="2026-01-01"
        )
        plaid_txns = response["transactions"]

        transactions = [{
            "amount": txn["amount"],
            "description": txn["name"],
            "timestamp": txn["date"],
            "fraud": txn["amount"] > 1000  # simple fraud rule
        } for txn in plaid_txns]

        user_transactions[user_id] = transactions
        return transactions
    except Exception as e:
        return [{"error": str(e)}]