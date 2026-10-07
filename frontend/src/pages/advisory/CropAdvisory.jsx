import { useEffect, useState } from "react";
import Alert from "../../components/Alert.jsx";
import CropCard from "../../components/CropCard.jsx";
import Loading from "../../components/Loading.jsx";
import { getCropAdvisory, listCrops } from "../../services/advisoryService";
import { SIGNAL_LABELS } from "../../utils/constants";
import { errorMessage } from "../../utils/helpers";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const months = (list) => list.map((m) => MONTHS[m - 1]).join(", ");

export default function CropAdvisory() {
  const [crops, setCrops] = useState([]);
  const [selected, setSelected] = useState(null);
  const [coords, setCoords] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { listCrops().then(setCrops).catch((e) => setError(errorMessage(e))); }, []);

  async function load(id, c = coords) {
    setSelected(id);
    setLoading(true);
    setError("");
    try {
      setData(await getCropAdvisory(id, c));
    } catch (e) {
      setError(errorMessage(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) return setError("This browser cannot share your location.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(c);
        if (selected) load(selected, c);
      },
      () => setError("Location access was blocked. Allow it in your browser settings to see weather alerts.")
    );
  }

  const d = data?.details;
  return (
    <>
      <div className="page-head">
        <h1>Crop advice</h1>
        <p>Growing guidance for each crop. Share your location to add weather alerts.</p>
        <button className="btn ghost small" onClick={useMyLocation}>{coords ? "Location on" : "Use my location"}</button>
      </div>
      <Alert>{error}</Alert>
      <div className="grid" style={{ marginBottom: "1.5rem" }}>
        {crops.map((c) => <CropCard key={c.id} crop={c} selected={selected === c.id} onSelect={load} />)}
      </div>
      {loading && <Loading />}
      {data && !loading && (
        <div className="stack">
          {data.alerts.map((a) => <Alert key={a} type="warn">{a}</Alert>)}
          {data.weather && (
            <section className="card">
              <h3>Weather now: {data.weather.temperature}°C, {data.weather.humidity}% humidity</h3>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Day</th><th className="num">High</th><th className="num">Low</th><th className="num">Rain (mm)</th></tr></thead>
                  <tbody>
                    {data.weather.forecast.map((f) => (
                      <tr key={f.date}><td>{f.date}</td><td className="num">{f.temp_max}°</td><td className="num">{f.temp_min}°</td><td className="num">{f.rain_mm}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          <section className="card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h2 style={{ margin: 0 }}>{data.crop.name}</h2>
              <span className={`tag ${data.market_signal}`}>{SIGNAL_LABELS[data.market_signal]}: {data.market_headline}</span>
            </div>
            <p className="muted">Sow: {months(data.crop.sowing_months)}. Harvest: {months(data.crop.harvest_months)}. About {data.crop.duration_days} days to maturity.</p>
            {d && (
              <div className="grid">
                <div><h3>Soil</h3><p>{d.soil}. pH {d.ph_range}.</p></div>
                <div><h3>Spacing</h3><p>{d.spacing}</p></div>
                <div><h3>Watering</h3><p>{d.irrigation}</p></div>
                <div><h3>Feeding</h3><p>{d.fertilizer}</p></div>
              </div>
            )}
            {d?.common_diseases?.length > 0 && <p><strong>Watch for:</strong> {d.common_diseases.join(", ")}</p>}
            {d?.tips?.length > 0 && <ul className="plain">{d.tips.map((t) => <li key={t}>{t}</li>)}</ul>}
          </section>
        </div>
      )}
    </>
  );
}
