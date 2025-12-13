# Tweet Sentiment Analyzer

A full-stack, real-time Twitter-style sentiment analysis app powered by my own trained machine learning model.

- **Frontend**: React + TypeScript + Tailwind CSS + Lucide icons (Vite)
- **Backend**: Python Flask serving a custom-trained Multinomial Naive Bayes model with TF-IDF (2-grams)
- **Features**:
  - Instant sentiment scoring (-100 to +100)
  - Live keyword extraction directly from TF-IDF weights
  - Beautiful Twitter-like feed with split-view detail

## Setup & Running the Project

### 1. Backend (Flask + ML Model)

```bash
cd backend

# Create and activate virtual environment (only needed first time)
python3 -m venv venv_good
source venv_good/bin/activate

# Install dependencies (only needed first time or after requirements change)
pip install -r requirements.txt
# or manually: pip install flask flask-cors joblib numpy scikit-learn

# Start the Flask server
python app.py
```

-> Server will run at http://127.0.0.1:5000
Keep this terminal open.

### Frontend (React App – Vite project in root)

In a new terminal tab (from the project root):

# Make sure you're in the main project folder (where package.json is)

npm install # Only needed first time or after package changes

# Start the development server

npm run dev
-> Open the URL shown in the terminal (usually http://localhost:5173)
