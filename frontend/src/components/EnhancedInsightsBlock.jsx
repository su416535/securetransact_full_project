import React from "react";

export default function EnhancedInsightsBlock({ insights }) {
  if (!insights) return null;

  return (
    <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
      <h3>Spending Insights</h3>
      <p><strong>Total Spending:</strong> ${insights.total_spending}</p>
      <p><strong>Average Transaction:</strong> ${insights.average_transaction}</p>
      <p><strong>Top Category:</strong> {insights.top_category}</p>
      <p><strong>Min Transaction:</strong> ${insights.min_transaction}</p>
      <p><strong>Max Transaction:</strong> ${insights.max_transaction}</p>
      <p><strong>Unusual Spending:</strong> {insights.unusual_spending_detected ? "Yes" : "No"}</p>

      <h4>Category Breakdown:</h4>
      <ul>
        {Object.entries(insights.category_breakdown || {}).map(([cat, data]) => (
          <li key={cat}>
            {cat}: ${data.total} ({data.count} transactions)
          </li>
        ))}
      </ul>

      <h4>Top Transactions:</h4>
      <ul>
        {insights.top_transactions.map((txn, idx) => (
          <li key={idx}>
            {txn.description} - ${txn.amount} @ {txn.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
}