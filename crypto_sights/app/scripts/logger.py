import json
import os
from datetime import datetime

LOG_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'query_logs.json')
def ensure_log_file_exists():
    if not os.path.exists(LOG_FILE_PATH):
        with open(LOG_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump([], f)

def log_query(coin, query, sentiment, top_results):
    ensure_log_file_exists()

    # Format sentiment properly
    if isinstance(sentiment, dict):
        sentiment_label = sentiment.get("label", "Unknown").capitalize()
        score = sentiment.get("score", "unknown")
        sentiment_text = f"{sentiment_label} (Score: {score})"
    elif isinstance(sentiment, str) and "Score:" not in sentiment:
        try:
            sentiment_label, score = sentiment.strip().split()
            sentiment_text = f"{sentiment_label.capitalize()} (Score: {score})"
        except Exception:
            sentiment_text = "Unknown (Score: unknown)"
    else:
        sentiment_text = sentiment or "Unknown (Score: unknown)"

    # Build log entry
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "coin": coin,
        "query": query,
        "sentiment": sentiment_text,
        "answers": []
    }

    # Format answers
    for entry in top_results:
        if isinstance(entry, tuple):
            if len(entry) == 3:
                excerpt, score, context = entry
            elif len(entry) == 2:
                excerpt, score = entry
                context = ""
            else:
                continue
        elif isinstance(entry, dict):
            excerpt = entry.get("excerpt", "")
            score = entry.get("score", 0.0)
            context = entry.get("source_context", "")
        else:
            continue

        log_entry["answers"].append({
            "excerpt": str(excerpt),
            "confidence": round(score, 4) if isinstance(score, (int, float)) else 0.0,
            "source_context": context
        })

    # Read current logs
    with open(LOG_FILE_PATH, 'r', encoding='utf-8') as f:
        try:
            logs = json.load(f)
            if not isinstance(logs, list):
                logs = []
        except json.JSONDecodeError:
            logs = []

    # Append and save
    logs.append(log_entry)
    with open(LOG_FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(logs, f, indent=4, ensure_ascii=False)

def read_query_logs():
    ensure_log_file_exists()
    with open(LOG_FILE_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)
