import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../../components/Alert.jsx";
import DiseaseCard from "../../components/DiseaseCard.jsx";
import Loading from "../../components/Loading.jsx";
import { deleteResult, getHistory } from "../../services/diseaseService";
import { errorMessage } from "../../utils/helpers";

export default function DiseaseHistory() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getHistory().then(setItems).catch((e) => setError(errorMessage(e)));
  }, []);

  async function remove(id) {
    if (!window.confirm("Delete this check and its photo?")) return;
    try {
      await deleteResult(id);
      setItems((list) => list.filter((i) => i.id !== id));
    } catch (e) {
      setError(errorMessage(e, "Could not delete this check."));
    }
  }

  return (
    <>
      <div className="page-head"><h1>Past checks</h1></div>
      <Alert>{error}</Alert>
      {!items && !error && <Loading />}
      {items?.length === 0 && (
        <p>You have not checked any leaves yet. <Link to="/disease">Check your first leaf</Link>.</p>
      )}
      <div className="grid">{items?.map((r) => <DiseaseCard key={r.id} result={r} onDelete={remove} />)}</div>
    </>
  );
}
