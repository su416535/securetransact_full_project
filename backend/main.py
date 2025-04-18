from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fraud_api import router as fraud_router
from bank_api import router as bank_router
from dispute_api import router as dispute_router
from insights_api import router as insights_router
from mock_transactions import router as mock_txn_router
from exchange_token_api import router as token_exchange_router  # 👈 Plaid token exchange
from link_token_api import router as link_token_router

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Register API routes
app.include_router(fraud_router, prefix="/api")
app.include_router(bank_router, prefix="/api")
app.include_router(dispute_router, prefix="/api")
app.include_router(insights_router, prefix="/api")
app.include_router(mock_txn_router, prefix="/api")
app.include_router(token_exchange_router, prefix="/api")  # 👈 NEW: /api/exchange-token
app.include_router(link_token_router, prefix="/api")

