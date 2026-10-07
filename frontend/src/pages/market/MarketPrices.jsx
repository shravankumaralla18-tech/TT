import { useEffect, useState } from "react";
import Alert from "../../components/Alert.jsx";
import Loading from "../../components/Loading.jsx";
import { listCrops } from "../../services/advisoryService";
import { getPrices } from "../../services/marketService";
import { errorMessage, formatPrice } from "../../utils/helpers";

const REGIONS = ["North", "South", "East", "West"];

export default function MarketPrices() {
  const [crops, setCrops] = useState([]);
  const [crop, setCrop] = useState("");
  const [region, setRegion] = useState("");
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { listCrops().then(setCrops).catch(() => {}); }, []);
  useEffect(() => {
    setRows(null);
    getPrices({ crop: crop || undefined, region: region || undefined })
      .then(setRows)
      .catch((e) => setError(errorMessage(e)));
  }, [crop, region]);

  return (
    <>
      <div className="page-head">
        <h1>Prices</h1>
        <p>Latest price per quintal in each market, with the change over the past 7 days.</p>
      </div>
      <Alert>{error}</Alert>
      <div className="row" style={{ marginBottom: "1rem" }}>
        <div style={{ minWidth: 180 }}>
          <label htmlFor="crop">Crop</label>
          <select id="crop" value={crop} onChange={(e) => setCrop(e.target.value)}>
            <option value="">All crops</option>
            {crops.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 180 }}>
          <label htmlFor="region">Region</label>
          <select id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">All regions</option>
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>
      {!rows ? <Loading /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Crop</th><th>Market</th><th>Region</th><th className="num">Low</th><th className="num">Typical</th><th className="num">High</th><th className="num">7-day change</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.crop_id}-${r.market}`}>
                  <td>{r.crop_name}</td><td>{r.market}</td><td>{r.region}</td>
                  <td className="num">{formatPrice(r.min_price)}</td>
                  <td className="num"><strong>{formatPrice(r.modal_price)}</strong></td>
                  <td className="num">{formatPrice(r.max_price)}</td>
                  <td className={`num ${r.change_7d_pct > 0 ? "up" : r.change_7d_pct < 0 ? "down" : ""}`}>
                    {r.change_7d_pct == null ? "-" : `${r.change_7d_pct > 0 ? "+" : ""}${r.change_7d_pct}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
