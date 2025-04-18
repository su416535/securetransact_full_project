from fastapi import APIRouter, Request
from plaid2.client import PlaidClient
from dotenv import load_dotenv
import os

router = APIRouter()
load_dotenv()

plaid = PlaidClient.from_env()

user_access_tokens = {}

@router.post("/exchange-token")
async def exchange_token(request: Request):
    data = await request.json()
    public_token = data.get("public_token")
    user_id = data.get("user_id", "guest")

    try:
        response = plaid.item_public_token_exchange(public_token)
        access_token = response["access_token"]

        # Store per-user access token in memory (you can replace with DB)
        user_access_tokens[user_id] = access_token
        return {"status": "success", "access_token": access_token}
    except Exception as e:
        return {"status": "error", "message": str(e)}