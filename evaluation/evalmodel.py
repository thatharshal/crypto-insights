
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer, util
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix
import pandas as pd
import numpy as np
import requests
import json
from datetime import datetime

# Initialize app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Load sentence transformer
model = SentenceTransformer('all-MiniLM-L6-v2')

# Validation Logic
def is_valid_entry(entry):
    coin = entry.get('coin', '').lower()
    query = entry.get('query', '').lower()
    answers = entry.get('answers', [])

    if coin == 'general crypto':
        return True
    if not query or not answers:
        return False

    coin_in_query = coin in query
    coin_in_answers = any(coin in ans.get('text', '').lower() for ans in answers)

    # Semantic similarity check
    coin_embedding = model.encode(coin, convert_to_tensor=True)
    answer_texts = [ans.get('text', '') for ans in answers]
    answer_embeddings = model.encode(answer_texts, convert_to_tensor=True)
    cosine_scores = util.cos_sim(coin_embedding, answer_embeddings)[0]
    threshold = 0.5
    similarity_valid = any(score >= threshold for score in cosine_scores)

    return coin_in_answers or similarity_valid

# API: Fetch Raw Logs
def fetch_logs_from_api():
    try:
        response = requests.get("http://127.0.0.1:5000/get_logs")
        response.raise_for_status()
        data = response.json()
        return data if isinstance(data, list) else []
    except Exception as e:
        print("Error fetching logs:", e)
        return []

# API: Filter Logs
@app.post("/get_logs")
async def get_logs_endpoint(data: list):
    results = []
    for entry in data:
        valid = is_valid_entry(entry)
        results.append({
            "coin": entry.get("coin", ""),
            "query": entry.get("query", ""),
            "status": "valid" if valid else "invalid",
            "answers": entry.get("answers", [])
        })
    return {"logs": results}

# Preprocess Logs
def vectorize_data(logs):
    df = pd.DataFrame(logs)
    df['answers'] = df['answers'].apply(lambda a: a[0].get('excerpt', '') if isinstance(a, list) and len(a) > 0 else '')
    df['text'] = df['coin'] + ' ' + df['query'] + ' ' + df['answers']

    # Label encode 'status'
    label_encoder = LabelEncoder()
    df['status_encoded'] = label_encoder.fit_transform(df['status'])

    # TF-IDF Vectorization
    tfidf = TfidfVectorizer()
    X_tfidf = tfidf.fit_transform(df['text'])
    X_df = pd.DataFrame(X_tfidf.toarray(), columns=tfidf.get_feature_names_out())
    X_df['status_encoded'] = df['status_encoded']

    return X_df


# Evaluate Model + Confusion Matrix
def evaluate_model(vectorised_df):
    X = vectorised_df.drop(columns=['status_encoded'])
    y = vectorised_df['status_encoded']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('model', RandomForestClassifier())
    ])

    param_grid = {
        'model__n_estimators': [25, 50, 100],
        'model__max_depth': [None, 5, 10]
    }

    grid = GridSearchCV(pipeline, param_grid, cv=5, scoring='accuracy')
    grid.fit(X_train, y_train)

    y_pred = grid.predict(X_test)

    # Confusion matrix for binary classification
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel() if cm.size == 4 else (0, 0, 0, 0)

    # Full classification metrics
    metrics = classification_report(y_test, y_pred, output_dict=True)
    if "0" in metrics:
        metrics["0"]["TN"] = int(tn)
        metrics["0"]["FP"] = int(fp)
        metrics["0"]["FN"] = int(fn)
        metrics["0"]["TP"] = int(tp)

    # Add timestamp
    return {
        "metrics": metrics,
        "timestamp": datetime.now().isoformat()
    }


# API: Evaluate Logs
@app.get("/get_evaluation")
async def get_evaluation():
    raw_logs = fetch_logs_from_api()
    if not raw_logs:
        raise HTTPException(status_code=500, detail="No logs received from the API.")

    validated_logs = []
    for entry in raw_logs:
        status = "valid" if is_valid_entry(entry) else "invalid"
        validated_logs.append({
            "coin": entry.get("coin", ""),
            "query": entry.get("query", ""),
            "status": status,
            "answers": entry.get("answers", [])
        })

    vectorised = vectorize_data(validated_logs)
    result = evaluate_model(vectorised)

    with open("metrics.json", "w") as f:
        json.dump(result, f, indent=4)

    return result

# Run Server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5050)
