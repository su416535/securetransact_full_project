# 🔐 SecureTransact – Full-Stack Financial App

SecureTransact is a modern, full-stack financial application prototype featuring:

- 🔐 Firebase Authentication (Email/Password)
- 📲 Real-Time Transaction Notifications
- 🤖 AI-Based Fraud Detection (ML Model)
- 🏦 Multi-Bank Aggregation (Mock API)
- ⚖️ Dispute Resolution Workflow
- 📊 Personalized Financial Insights

---

## 🚀 Project Structure

```
securetransact/
├── backend/                # FastAPI backend
│   ├── main.py
│   ├── fraud_api.py
│   ├── bank_api.py
│   ├── dispute_api.py
│   ├── insights_api.py
│   ├── mock_transactions.py
│   ├── fraud_model.pkl
│   └── requirements.txt
├── frontend/               # React + Vite frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       └── components/
│           └── AuthCard.jsx
└── README.md
```

---

## ⚙️ Backend Setup (FastAPI + ML)

1. Navigate to backend:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate it:
   - **Windows**: `venv\Scripts\activate`
   - **macOS/Linux**: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   - **Windows**: venv\Scripts\activate
   pip uninstall numpy scikit-learn -y
   pip install numpy==1.23.5 scikit-learn==1.1.3
   pip install numpy==1.23.5 scikit-learn==1.1.3 --force-reinstall --no-cache-dir
   pip install plaid2
   pip install plaid-python
   pip install python-dotenv

   ```

5. Run the backend:FASTAPI server
   ```bash
   uvicorn main:app --reload --host localhost
or uvicorn main:app --reload --host 0.0.0.0
 
   
   ```

Backend runs on `http://localhost:8000`
To view swagger API: http://localhost:8000/docs

---

## 🎨 Frontend Setup (React + Vite)

1. Navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   npm install --save-dev @vitejs/plugin-react
   npm install --save-dev @rollup/plugin-alias
 #  npx tailwindcss init -p
   npm install firebase
   npm install -g firebase-tools
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   firebase login
 #  firebase init
 #  firebase deploy
   ## transact-b0c7e.web.app
   npm install chart.js react-chartjs-2
   npm install react-plaid-link


   ```

3. Run the app:
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173`
Your firebase should be running Firebase on : http://localhost:9005/
---

## 🔑 Firebase Config (Replace in `AuthCard.jsx`)

```js
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

- You can get these values from your Firebase Console.
- Enable **Email/Password Authentication** in Firebase → Authentication.

---

## 🛠 Common Troubleshooting

### ❌ `'vite' is not recognized`
➡️ Use this instead:
```bash
npm run dev
```

### ❌ `Cannot find module '@vitejs/plugin-react'`
➡️ Run this:
```bash
npm install --save-dev @vitejs/plugin-react
```

### ❌ CORS errors from frontend
➡️ FastAPI already enables CORS in `main.py`. Ensure frontend uses `/api` proxy in `vite.config.js`.

uvicorn main:app --reload --host localhost
or uvicorn main:app --reload --host 0.0.0.0


---

## ✅ All Set!
You now have a working full-stack app for secure, smart, and seamless financial experiences. 💰✨