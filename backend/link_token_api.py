from fastapi import APIRouter, Request
from plaid2.client import PlaidClient
from dotenv import load_dotenv

load_dotenv()  # Load from .env

router = APIRouter()
plaid_client = PlaidClient.from_env()

@router.post("/create-link-token")
def create_link_token(request: Request):
    user_id = request.query_params.get("user_id") or "default-user"

    response = plaid_client.link_token_create(
        user={"client_user_id": user_id},
        client_name="SecureTransact",
        products=["transactions"],
        country_codes=["US"],
        language="en"
    )
    return {"link_token": response.link_token}
