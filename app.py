from flask import Flask, render_template, jsonify

app = Flask(__name__)

# ---- Apna Tableau Public embed link yahan paste karo ----
TABLEAU_URL = "https://public.tableau.com/views/YOUR_WORKBOOK/YOUR_DASHBOARD?:showVizHome=no&:embed=true"

# ---- SAMPLE DATA: baad mein apne Tableau ke actual numbers se replace karenge ----
EV_DATA = {
    "kpis": {
        "total_sales": 6370,
        "manufacturers": 6,
        "avg_range": 412,
        "top_battery": "Lithium-ion",
    },
    "manufacturer_sales": {
        "labels": ["Tesla", "BYD", "Volkswagen", "Hyundai", "BMW", "Nissan"],
        "values": [1850, 1620, 980, 760, 640, 520],
    },
    "battery_share": {
        "labels": ["Lithium-ion", "LFP", "NMC", "Solid-state"],
        "values": [48, 26, 20, 6],
    },
    "category_range": {
        "labels": ["Luxury", "SUV", "Sedan", "Hatchback", "Compact"],
        "values": [560, 470, 430, 340, 280],
    },
    "capacity_vs_range": [
        {"x": 30, "y": 210}, {"x": 40, "y": 270}, {"x": 50, "y": 330},
        {"x": 60, "y": 380}, {"x": 75, "y": 450}, {"x": 85, "y": 500},
        {"x": 100, "y": 580}, {"x": 45, "y": 300}, {"x": 70, "y": 420},
    ],
    "region_count": {
        "labels": ["Asia", "Europe", "North America", "South America", "Africa"],
        "values": [2900, 1800, 1300, 250, 120],
    },
    "yearly_sales": {
        "labels": [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
        "values": [210, 290, 410, 620, 780, 850, 1100, 1450, 1900, 2400],
    },
}


@app.route("/")
def home():
    return render_template("index.html", tableau_url=TABLEAU_URL)


@app.route("/api/data")
def api_data():
    return jsonify(EV_DATA)


if __name__ == "__main__":
    app.run(debug=True)