import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

export default function TransactionPieChart({ transactions }) {
  if (!transactions || transactions.length === 0) return null;

  const categoryMap = {};
  transactions.forEach((txn) => {
    const cat = txn.description;
    categoryMap[cat] = (categoryMap[cat] || 0) + txn.amount;
  });

  const labels = Object.keys(categoryMap);
  const data = Object.values(categoryMap);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Spending by Category',
        data,
        backgroundColor: [
          '#3b82f6',
          '#f59e0b',
          '#10b981',
          '#ef4444',
          '#8b5cf6',
          '#ec4899',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "300px", marginLeft: "40px" }}>
      <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Category Breakdown</h4>
      <Pie data={chartData} />
    </div>
  );
}