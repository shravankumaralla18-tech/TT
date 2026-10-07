import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Alert from "../../components/Alert.jsx";
import Loading from "../../components/Loading.jsx";
import { getResult } from "../../services/diseaseService";
import { errorMessage, formatDate, imageSrc, percent } from "../../utils/helpers";

function List({ title, items }) {
  if (!items?.length) return null;
  return (
    <section className="card">
      <h3>{title}</h3>
      <ul className="plain">{items.map((t) => <li key={t}>{t}</li>)}</ul>
    </section>
  );
}

export default function DiseaseResult() {
  const { id } = useParams();
  const { state } = useLocation();
  const [result, setResult] = useState(state?.result?.id === id ? state.result : null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (result) return;
    getResult(id).then(setResult).catch((e) => setError(errorMessage(e, "Could not load this result.")));
  }, [id, result]);

  if (error) return <Alert>{error}</Alert>;
  if (!result) return <Loading />;

  return (
    <>
      <div className="page-head">
        <h1>{result.crop}: {result.disease}</h1>
        <p className="muted">Checked {formatDate(result.created_at)}</p>
      </div>
      {result.low_confidence && (
        <Alert type="warn">
          The model is not sure about this photo ({percent(result.confidence)}). Retake it closer, in daylight, on a single leaf, and compare with the other possibilities below.
        </Alert>
      )}
      <div className="result-grid">
        <div className="stack">
          <img src={imageSrc(result.image_url)} alt={`${result.crop} leaf`} />
          <div className="card">
            <h3>Match: {percent(result.confidence)}</h3>
            <div className="stack" style={{ gap: ".6rem" }}>
              {result.top_predictions.map((p) => (
                <div key={p.label}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <span>{p.label.replace(/___/g, ": ").replace(/_/g, " ").trim()}</span>
                    <span className="muted">{percent(p.confidence)}</span>
                  </div>
                  <div className="bar"><span style={{ width: `${p.confidence * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="stack">
          <section className="card">
            <span className={`tag ${result.is_healthy ? "" : "bad"}`}>{result.is_healthy ? "Healthy" : "Disease found"}</span>
            <p style={{ marginTop: ".6rem" }}>{result.description}</p>
          </section>
          <List title="What to look for" items={result.symptoms} />
          <List title="Organic and cultural control" items={result.treatment.organic} />
          <List title="Chemical control" items={result.treatment.chemical} />
          <List title="Prevent it next season" items={result.treatment.preventive} />
          <div className="row">
            <Link className="btn" to="/disease">Check another leaf</Link>
            <Link className="btn ghost" to="/disease/history">Past checks</Link>
          </div>
        </div>
      </div>
    </>
  );
}
