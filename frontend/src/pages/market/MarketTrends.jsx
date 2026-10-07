import { useEffect, useState } from "react";
import Alert from "../../components/Alert.jsx";
import Loading from "../../components/Loading.jsx";
import PriceChart from "../../components/PriceChart.jsx";
import { listCrops } from "../../services/advisoryService";
import { getTrends } from "../../services/marketService";
import { errorMessage, formatPrice } from "../../utils/helpers";

export default function MarketTrends() {
  const [crops, setCrops] = useState([]);
  const [crop, setCrop] = useState("tomato");
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { listCrops().then(setCrops).catch((e) => setError(errorMessage(e))); }, []);
  useEffect(() => {
    setData(null);
    setError("");
    getTrends(crop, days).then(setData).catch((e) => setError(errorMessage(e)));
  }, [crop, days]);

  const first = data?.[0]?.price;
  const last = data?.[data.length - 1]?.price;
  const change = first && last ? ((last - first) / first) * 100 : null;

  return (
    <>
      <div className="page-head">
        <h1>Price trends</h1>
        <p>Average price across all markets.</p>
      </div>
      <Alert>{error}</Alert>
      <div className="row" style={{ marginBottom: "1rem" }}>
        <div style={{ minWidth: 180 }}>
          <label htmlFor="crop">Crop</label>
          <select id="crop" value={crop} onChange={(e) => setCrop(e.target.value)}>
            {crops.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 180 }}>
          <label htmlFor="days">Period</label>
          <select id="days" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={45}>Last 45 days</option>
          </select>
        </div>
      </div>
      {!data && !error ? <Loading /> : data && (
        <div className="card">
          <p>
            Now <strong>{formatPrice(last)}</strong> per quintal.{" "}
            <span className={change >= 0 ? "up" : "down"}>{change >= 0 ? "Up" : "Down"} {Math.abs(change).toFixed(1)}%</span> over {days} days.
          </p>
          <PriceChart data={data} />
        </div>
      )}
    </>
  );
}
