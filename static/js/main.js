const COLORS = ["#00a86b", "#1e90ff", "#ff9f1c", "#e63946", "#8e44ad", "#2ec4b6"];
let mfrChart = null;
let DATA = null;

function baseOptions(extra = {}) {
  return Object.assign({
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false } }
  }, extra);
}

function drawManufacturer(type) {
  const d = DATA.manufacturer_sales;
  if (mfrChart) mfrChart.destroy();
  mfrChart = new Chart(document.getElementById("mfrChart"), {
    type: type,
    data: {
      labels: d.labels,
      datasets: [{ label: "Units Sold", data: d.values, backgroundColor: COLORS, borderRadius: 6 }]
    },
    options: baseOptions({
      plugins: { legend: { display: type === "doughnut", position: "bottom" } }
    })
  });
}

function buildCharts() {
  // KPIs
  const k = DATA.kpis;
  document.getElementById("kpi-sales").textContent = k.total_sales.toLocaleString();
  document.getElementById("kpi-mfr").textContent = k.manufacturers;
  document.getElementById("kpi-range").textContent = k.avg_range;
  document.getElementById("kpi-battery").textContent = k.top_battery;

  // Manufacturer
  drawManufacturer("bar");
  document.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      drawManufacturer(btn.dataset.type);
    });
  });

  // Battery share
  new Chart(document.getElementById("batteryChart"), {
    type: "pie",
    data: {
      labels: DATA.battery_share.labels,
      datasets: [{ data: DATA.battery_share.values, backgroundColor: COLORS }]
    },
    options: baseOptions({ plugins: { legend: { display: true, position: "bottom" } } })
  });

  // Capacity vs Range
  new Chart(document.getElementById("scatterChart"), {
    type: "scatter",
    data: { datasets: [{ label: "EV Models", data: DATA.capacity_vs_range, backgroundColor: "#1e90ff", pointRadius: 6 }] },
    options: baseOptions({
      scales: {
        x: { title: { display: true, text: "Battery Capacity (kWh)" } },
        y: { title: { display: true, text: "Range (km)" } }
      }
    })
  });

  // Category range (horizontal bar)
  new Chart(document.getElementById("categoryChart"), {
    type: "bar",
    data: {
      labels: DATA.category_range.labels,
      datasets: [{ label: "Avg Range (km)", data: DATA.category_range.values, backgroundColor: "#00a86b", borderRadius: 6 }]
    },
    options: baseOptions({ indexAxis: "y" })
  });

  // Region
  new Chart(document.getElementById("regionChart"), {
    type: "bar",
    data: {
      labels: DATA.region_count.labels,
      datasets: [{ label: "EV Count", data: DATA.region_count.values, backgroundColor: "#ff9f1c", borderRadius: 6 }]
    },
    options: baseOptions()
  });

  // Yearly trend
  new Chart(document.getElementById("yearChart"), {
    type: "line",
    data: {
      labels: DATA.yearly_sales.labels,
      datasets: [{
        label: "Sales", data: DATA.yearly_sales.values,
        borderColor: "#00a86b", backgroundColor: "rgba(0,168,107,.15)",
        fill: true, tension: 0.35, pointRadius: 5
      }]
    },
    options: baseOptions({ plugins: { legend: { display: true } } })
  });
}

fetch("/api/data")
  .then(r => r.json())
  .then(json => { DATA = json; buildCharts(); })
  .catch(err => console.error("Data load error:", err));