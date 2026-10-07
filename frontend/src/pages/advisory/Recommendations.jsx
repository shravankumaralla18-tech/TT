import { useEffect, useState } from "react";
import Alert from "../../components/Alert.jsx";
import Loading from "../../components/Loading.jsx";
import { getRecommendations } from "../../services/advisoryService";
import { SIGNAL_LABELS } from "../../utils/constants";
import { errorMessage, formatPrice } from "../../utils/helpers";

export default function Recommendations() {
  const [recs, setRecs] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { getRecommendations().then(setRecs).catch((e) => setError(errorMessage(e))); }, []);

  return (
    <>
      <div className="page-head">
        <h1>This month</h1>
        <p>Crops in their sowing or harvest window now, with the current market signal.</p>
      </div>
      <Alert>{error}</Alert>
      {!recs && !error && <Loading />}
      {recs?.length === 0 && <p className="muted">No crops are in a sowing or harvest window this month.</p>}
      <div className="grid">
        {recs?.map((r) => (
          <article className="card" key={`${r.crop_id}-${r.action}`}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h3 style={{ margin: 0 }}>{r.crop_name}</h3>
              <span className={`tag ${r.market_signal}`}>{SIGNAL_LABELS[r.market_signal]}</span>
            </div>
            <h2 style={{ marginTop: ".5rem" }}>{r.action}</h2>
            <p>{r.reason}</p>
            <p className="muted" style={{ marginBottom: 0 }}>Price now {formatPrice(r.latest_price)} per quintal</p>
          </article>
        ))}
      </div>
    </>
  );
}
