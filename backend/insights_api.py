from fastapi import APIRouter
from pydantic import BaseModel
from collections import Counter, defaultdict
from typing import List

router = APIRouter()

class Txn(BaseModel):
    amount: float
    description: str
    timestamp: str

@router.post("/insights")
def get_insights(transactions: List[Txn]):
    if not transactions:
        return {
            "message": "No transactions available",
            "total_spending": 0,
            "average_transaction": 0,
            "top_category": None,
            "min_transaction": 0,
            "max_transaction": 0,
            "unusual_spending_detected": False,
            "category_breakdown": {},
            "top_transactions": []
        }

    # Basic aggregations
    total_spending = sum(txn.amount for txn in transactions)
    average_transaction = total_spending / len(transactions)
    min_transaction = min(txn.amount for txn in transactions)
    max_transaction = max(txn.amount for txn in transactions)

    # Category-wise aggregation
    category_sums = defaultdict(float)
    category_counts = defaultdict(int)

    for txn in transactions:
        cat = txn.description.split()[0]
        category_sums[cat] += txn.amount
        category_counts[cat] += 1

    top_category = max(category_sums.items(), key=lambda x: x[1])[0]

    # Unusual detection (static or dynamic threshold)
    unusual_flag = any(txn.amount > 150 or txn.amount > average_transaction * 2 for txn in transactions)
    top_txns = sorted(transactions, key=lambda x: x.amount, reverse=True)[:3]

    return {
        "total_spending": round(total_spending, 2),
        "average_transaction": round(average_transaction, 2),
        "top_category": top_category,
        "min_transaction": round(min_transaction, 2),
        "max_transaction": round(max_transaction, 2),
        "unusual_spending_detected": unusual_flag,
        "category_breakdown": {k: {"total": round(category_sums[k], 2), "count": category_counts[k]} for k in category_sums},
        "top_transactions": [txn.dict() for txn in top_txns]
    }
