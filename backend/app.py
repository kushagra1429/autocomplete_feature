from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow requests from frontend (Next.js)

# Base URL for OpenStreetMap Nominatim
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"


@app.route("/")
def home():
    return jsonify({"message": "Autocomplete API is running"})


@app.route("/api/search", methods=["GET"])
def search():
    query = request.args.get("q")

    # ✅ Handle empty query
    if not query or query.strip() == "":
        return jsonify([])

    try:
        res = requests.get(
            NOMINATIM_URL,
            params={
                "q": query,
                "format": "json",
                "addressdetails": 1,
                "limit": 5   # limit results
            },
            headers={
                "User-Agent": "autocomplete-app"  # required by Nominatim
            },
            timeout=5
        )

        data = res.json()

        # ✅ Transform response (clean structure)
        formatted_results = [
            {
                "id": item.get("place_id"),
                "name": item.get("display_name"),
                "lat": item.get("lat"),
                "lon": item.get("lon")
            }
            for item in data
        ]

        return jsonify(formatted_results)

    except Exception as e:
        return jsonify({
            "error": "Something went wrong",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)