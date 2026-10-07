import { Link } from "react-router-dom";
import { formatDate, imageSrc, percent } from "../utils/helpers";

export default function DiseaseCard({ result, onDelete }) {
  return (
    <article className="card">
      <img className="thumb" src={imageSrc(result.image_url)} alt={`${result.crop} leaf`} />
      <h3>
        {result.crop}: {result.disease}
      </h3>
      <p className="row" style={{ marginBottom: ".5rem" }}>
        <span className={`tag ${result.is_healthy ? "" : "bad"}`}>{result.is_healthy ? "Healthy" : "Needs action"}</span>
        <span className="muted">{percent(result.confidence)} match</span>
      </p>
      <p className="muted">{formatDate(result.created_at)}</p>
      <div className="row">
        <Link className="btn small" to={`/disease/result/${result.id}`} state={{ result }}>
          View result
        </Link>
        {onDelete && (
          <button className="btn danger small" onClick={() => onDelete(result.id)}>
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
