# evalbackend.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
import json
import os
import requests 
import socket
import time
import subprocess

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
# Get absolute base dir
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # This gets the directory of evalbackend

def wait_for_port(host, port, timeout=30):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            with socket.create_connection((host, port), timeout=1):
                return True
        except OSError:
            time.sleep(0.5)
    return False

# Determine the path to evalmodel.py
current_dir = os.path.dirname(os.path.abspath(__file__))
evalmodel_path = os.path.join(current_dir, "evalmodel.py")

# Start evalmodel.py in background
subprocess.Popen(["python", evalmodel_path])

# Wait until port 5050 is open
if wait_for_port("127.0.0.1", 5050):
    print("evalmodel.py is up and running!")
else:
    print("Timeout: evalmodel.py did not start in time. It will start later.")



BASE_DIR = os.path.dirname(os.path.abspath(__file__))
METRICS_API_URL = "http://127.0.0.1:5050/get_evaluation"  
METRICS_FILE_PATH = os.path.join(BASE_DIR, "..", "crypto_sights", "app", "data", "metrics.json")


def update_metrics(file_path=METRICS_FILE_PATH):
    print("Updating metrics... This will take ~210 seconds.")
    # Simulate long-running task (e.g. ML model)
    time.sleep(210)
    print("Metrics update complete.")
    try:
        response = requests.get(METRICS_API_URL)
        response.raise_for_status()

        new_metrics = response.json()
        new_metrics["timestamp"] = datetime.now().isoformat()

        print(f"Attempting to save metrics to: {file_path}")

        # Load existing data if file exists and is valid
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r') as f:
                    existing_data = json.load(f)
                if not isinstance(existing_data, list):
                    existing_data = []
            except json.JSONDecodeError:
                existing_data = []
        else:
            existing_data = []

        # Append new entry and keep only the last 7
        existing_data.append(new_metrics)
        existing_data = existing_data[-7:]

        # Save updated list
        with open(file_path, 'w') as f:
            json.dump(existing_data, f, indent=4)

        print("Metrics updated at", new_metrics["timestamp"])
        print("Saved to:", os.path.abspath(file_path))

    except Exception as e:
        print("Error in update_metrics:", e)



@app.get("/get_metrics")
def get_all_metrics():
    if not os.path.exists(METRICS_FILE_PATH):
        raise HTTPException(status_code=404, detail="Metrics file not found")
    try:
        with open(METRICS_FILE_PATH, 'r') as f:
            return json.load(f)  # now returns a list
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON format")



scheduler = BackgroundScheduler()
scheduler.add_job(update_metrics, CronTrigger(hour=3, minute=0))
# scheduler.add_job(update_metrics, 'interval', seconds=250)
scheduler.start()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
