from flask import Blueprint, current_app, request, jsonify, render_template, send_file, send_from_directory
import os

main_bp = Blueprint("main", __name__)

@main_bp.route("/")
def home():
    return render_template("index.html")

@main_bp.route("/about")
def about():
    return render_template("about_us.html")

@main_bp.route("/evaluation_landing")
def evaluation_landing():
    return render_template("evaluation_landing.html")

@main_bp.route("/evaluation")
def evaluation():
    return render_template("evaluation.html")

@main_bp.route("/declaration")
def declaration():
    return render_template("declaration.html")

@main_bp.route("/faq")
def faq():
    return render_template("faq.html")

@main_bp.route("/main")
def main():
    return render_template("main_query.html")

@main_bp.route("/privacy")
def privacy():
    return render_template("privacy.html")

@main_bp.route("/terms")
def terms():
    return render_template("terms_of_service.html")

@main_bp.route('/get_logs', methods=['GET'])
def get_query_logs():
    filename = "query_logs.json"
    filepath = os.path.join(current_app.root_path, 'data', filename)
    directory = os.path.dirname(filepath) # Need directory for send_from_directory

    if os.path.exists(filepath):
        return send_from_directory(directory, filename, mimetype='application/json', as_attachment=False)
    else:
        return jsonify({'error': 'query_logs.json not found'}), 404
    
@main_bp.route("/query", methods=["POST"])
def handle_query():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided."}), 400

        coin = data.get("coin", "").lower().strip()
        query = data.get("query", "").strip()

        COINS = current_app.config["COINS"]
        engine = current_app.config["ENGINE"]
        log_query = current_app.config["LOG_QUERY_FUNC"]

        if not coin or not query:
            return jsonify({"error": "Please provide both coin and query."}), 400

        if coin not in COINS:
            return jsonify({"error": f"Unsupported coin. Choose from: {', '.join(COINS)}."}), 400

        if not engine.valid_query(query):
            return jsonify({
                "error": "Query seems unrelated to crypto. Try asking something like 'What's the trend of Bitcoin this week?'"
            }), 400

        result = engine.process_query(query)

        if not result:
            return jsonify({"message": "No relevant results found."}), 200

        response = engine.format_response(result, query)

        sentiment_label = response.get("analysis", {}).get("sentiment", "Unknown")
        sentiment_score = max(
            float(ans.get("confidence", 0.0)) for ans in response.get("answers", [])
        ) if response.get("answers") else 0.0
        sentiment = {"label": sentiment_label, "score": f"{sentiment_score:.2f}"}

        top_results = [
            {
                "excerpt": ans.get("excerpt", ""),
                "score": float(ans.get("confidence", 0.0)),
                "source_context": ans.get("source_context", "")
            }
            for ans in response.get("answers", [])
        ]

        log_query(coin, query, sentiment, top_results)

        return jsonify(response), 200

    except Exception as e:
        import traceback
        print("ERROR:", traceback.format_exc())
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
