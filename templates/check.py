import csv
from collections import defaultdict

sales_mfr = defaultdict(float)
battery = defaultdict(int)
cat_sum = defaultdict(float)
cat_cnt = defaultdict(int)
sales_year = defaultdict(float)
total_sales = 0
range_sum = 0
n = 0

with open('ev_market_train.csv', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        try:
            s = float(row['annual_sales_units'])
            r = float(row['range_km'])
        except (ValueError, KeyError):
            continue
        sales_mfr[row['manufacturer']] += s
        battery[row['battery_type']] += 1
        cat_sum[row['category']] += r
        cat_cnt[row['category']] += 1
        sales_year[row['model_year']] += s
        total_sales += s
        range_sum += r
        n += 1

print("TOTAL_SALES", int(total_sales))
print("AVG_RANGE", round(range_sum / n, 1))
print("MANUFACTURERS", len(sales_mfr))
print("TOP_MFR", sorted(((int(v), k) for k, v in sales_mfr.items()), reverse=True)[:3])
print("BATTERY", dict(battery))
print("CATEGORY", {k: round(cat_sum[k] / cat_cnt[k]) for k in cat_sum})
print("YEAR", {k: int(v) for k, v in sorted(sales_year.items())})