import React, { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import '../index.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import TransactionPieChart from './TransactionPieChart';
import EnhancedInsightsBlock from "./EnhancedInsightsBlock";

const firebaseConfig = {
  apiKey: "AIzaSyB0bu_--g5fkRE696XEivEbl92sVJQkYr0",
  authDomain: "transact-b0c7e.firebaseapp.com",
  projectId: "transact-b0c7e",
  storageBucket: "transact-b0c7e.firebasestorage.app",
  messagingSenderId: "435161187790",
  appId: "1:435161187790:web:7ccbf0ebb27a9c8a29979f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function AuthCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [disputedTxns, setDisputedTxns] = useState([]);
  const [insights, setInsights] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      alert(error.message);
    }
  };

  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setTransactions([]);
    setBankAccounts([]);
    setDisputedTxns([]);
    setInsights(null);
  };

  const linkBankAccount = async () => {
    const res = await fetch("/api/link-bank", { method: "POST" });
    const data = await res.json();
    setBankAccounts([...bankAccounts, data]);
    alert(`Bank linked: ${data.name}`);
  };

  const disputeTransaction = async (txn) => {
    const res = await fetch("/api/dispute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(txn)
    });
    const result = await res.json();
    if (result.status === "received") {
      alert(`Dispute submitted for transaction: ${txn.description}`);
      setDisputedTxns([...disputedTxns, txn]);
    }
  };

  const fetchInsights = async () => {
    const res = await fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactions)
    });
    const data = await res.json();
    setInsights(data);
  };

  const exportToCSV = () => {
    const csv = [
      ["Description", "Amount", "Timestamp", "Fraud Risk", "Status"],
      ...transactions.map(txn => [
        txn.description,
        txn.amount,
        txn.timestamp,
        txn.fraud ? "High" : "Low",
        txn.fraud ? "Not Safe" : "Safe"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
  };

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        fetch("/api/mock-transactions")
          .then((res) => res.json())
          .then(async (data) => {
            if (data.length > transactions.length) {
              const newTxns = data.slice(transactions.length);
              const updatedTxns = await Promise.all(
                newTxns.map(async (txn) => {
                  const fraudRes = await fetch("/api/predict-fraud", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(txn)
                  });
                  const result = await fraudRes.json();
                  return { ...txn, fraud: result.fraud };
                })
              );
              setTransactions([...transactions, ...updatedTxns]);
            }
          });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user, transactions]);

  const filteredTxns = transactions.filter(txn => {
    if (!startDate || !endDate) return true;
    const t = new Date(txn.timestamp);
    return t >= new Date(startDate) && t <= new Date(endDate);
  });

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: '#0d1b2a', color: '#ffffff' }}>
      <aside style={{ width: "240px", backgroundColor: "#1b263b", padding: "20px" }}>
        <h2>SecureTransact</h2>
        {user && (
          <>
            <div className="nav-link" onClick={linkBankAccount}>Link Bank Account</div>
            <div className="nav-link" onClick={fetchInsights}>View Insights</div>
          </>
        )}
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "12px 20px", backgroundColor: "#1e293b" }}>
          {user && (
            <>
              <span style={{ marginRight: "16px" }}>Welcome, {user.email}</span>
              <button onClick={logout} style={{ backgroundColor: "#334155", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Logout
              </button>
            </>
          )}
        </header>

        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "30px" }}>
          <div style={{ display: "flex", width: "100%", maxWidth: "1100px", backgroundColor: "#ffffff", color: "#1e293b", padding: "24px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
            {user ? (
              <>
                <div style={{ flex: 3, maxHeight: "75vh", overflowY: "auto", paddingRight: "20px" }}>
                  <h3>Linked Banks</h3>
                  <ul>
                    {bankAccounts.map((bank, index) => (
                      <li key={index}>{bank.name} - {bank.account_id}</li>
                    ))}
                  </ul>

                  <h3 style={{ marginTop: "20px" }}>Transactions</h3>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <label>Start Date: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label>
                    <label>End Date: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></label>
                    <Button onClick={exportToCSV}>Export CSV</Button>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#e2e8f0" }}>
                        <th style={{ padding: "12px" }}>Description</th>
                        <th>Fraud Risk</th>
                        <th>Status</th>
                        <th>Dispute</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTxns.map((txn, index) => (
                        <tr key={index} style={{ borderBottom: "1px solid #cbd5e1" }}>
                          <td style={{ padding: "10px" }}>{txn.description}: ${txn.amount} @ {txn.timestamp}</td>
                          <td style={{ textAlign: "center" }}>{txn.fraud ? "High" : "Low"}</td>
                          <td style={{ color: txn.fraud ? "red" : "green", textAlign: "center" }}>
                            {txn.fraud ? "Not Safe" : "Safe"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {!disputedTxns.includes(txn) && (
                              <Button onClick={() => disputeTransaction(txn)}>Dispute</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <EnhancedInsightsBlock insights={insights} />
                </div>
                <TransactionPieChart transactions={filteredTxns} />
              </>
            ) : (
              <div style={{ width: "100%" }}>
                <h2 style={{ color: "#1e293b" }}>Sign In / Register</h2>
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2" />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Button onClick={login}>Login</Button>
                  <Button onClick={register}>Register</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}