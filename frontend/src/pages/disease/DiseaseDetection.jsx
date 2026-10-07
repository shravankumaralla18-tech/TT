import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert.jsx";
import Loading from "../../components/Loading.jsx";
import { detect } from "../../services/diseaseService";
import { errorMessage } from "../../utils/helpers";

const MAX_MB = 8;

export default function DiseaseDetection() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  function pick(f) {
    setError("");
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) return setError("Choose a JPG, PNG or WebP photo.");
    if (f.size > MAX_MB * 1024 * 1024) return setError(`Photo is larger than ${MAX_MB} MB. Choose a smaller one.`);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function analyse() {
    setBusy(true);
    setError("");
    try {
      const result = await detect(file);
      navigate(`/disease/result/${result.id}`, { state: { result } });
    } catch (e) {
      setError(errorMessage(e, "Could not analyse this photo."));
      setBusy(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>Check a leaf</h1>
        <p>Take a clear, close photo of one affected leaf in daylight. Fill the frame and keep the background plain.</p>
      </div>
      <Alert>{error}</Alert>
      <div
        className={`specimen ${over ? "over" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files[0]); }}
      >
        {preview ? (
          <img src={preview} alt="Selected leaf" />
        ) : (
          <div>
            <strong>Tap to take or choose a photo</strong>
            <p className="muted">or drop an image here. JPG, PNG or WebP up to {MAX_MB} MB.</p>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => pick(e.target.files[0])} />
      <div className="row" style={{ marginTop: "1rem" }}>
        <button className="btn" disabled={!file || busy} onClick={analyse}>Analyse leaf</button>
        {file && !busy && <button className="btn ghost" onClick={() => { setFile(null); setPreview(null); }}>Choose another</button>}
      </div>
      {busy && <Loading label="Analysing your photo..." />}
    </>
  );
}
