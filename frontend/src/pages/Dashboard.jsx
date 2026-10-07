import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import DiseaseCard from "../components/DiseaseCard.jsx";
import Loading from "../components/Loading.jsx";
import useAuth from "../hooks/useAuth";
import * as diseaseService from "../services/diseaseService";
import { getRecommendations } from "../services/advisoryService";
import { SIGNAL_LABELS } from "../utils/constants";
import { errorMessage, formatPrice } from "../utils/helpers";

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([diseaseService.getHistory(), getRecommendations()])
      .then(([h, r]) => {
        setHistory(h.slice(0, 3));
        setRecs(r);
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-head">
        <h1>Hello, {user?.name?.split(" ")[0]}</h1>
        <p>Photograph a sick leaf to find out what it is, or check whether today is a good day to sell.</p>
        <div className="row">
          <Link className="btn" to="/disease">Check a leaf</Link>
          <Link className="btn ghost" to="/market">Sell or hold?</Link>
        </div>
      </div>
      <Alert>{error}</Alert>
      {loading ? (
        <Loading />
      ) : (
        <div className="stack">
          <section>
            <h2>This month</h2>
            {recs.length === 0 ? (
              <p className="muted">No crops are in a sowing or harvest window this month.</p>
            ) : (
              <div className="grid">
                {recs.map((r) => (
                  <article className="card" key={r.crop_id}>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <h3 style={{ margin: 0 }}>{r.crop_name}</h3>
                      <span className={`tag ${r.market_signal}`}>{SIGNAL_LABELS[r.market_signal]}</span>
                    </div>
                    <p style={{ margin: ".4rem 0 0" }}><strong>{r.action}</strong>. Price {formatPrice(r.latest_price)}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
          <section>
            <h2>Recent leaf checks</h2>
            {history.length === 0 ? (
              <p className="muted">No checks yet. Upload your first leaf photo to start your history.</p>
            ) : (
              <div className="grid">{history.map((h) => <DiseaseCard key={h.id} result={h} />)}</div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
