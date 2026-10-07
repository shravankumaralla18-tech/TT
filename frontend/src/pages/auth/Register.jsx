import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Alert from "../../components/Alert.jsx";
import useAuth from "../../hooks/useAuth";
import { errorMessage } from "../../utils/helpers";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", location: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await register({ ...form, location: form.location || null });
      navigate("/", { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Could not create the account."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <form className="card" onSubmit={submit}>
        <h1>Create an account</h1>
        <Alert>{error}</Alert>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" required minLength={2} autoComplete="name" value={form.name} onChange={set("name")} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} />
        </div>
        <div className="field">
          <label htmlFor="password">Password (8 characters or more)</label>
          <input id="password" type="password" required minLength={8} autoComplete="new-password" value={form.password} onChange={set("password")} />
        </div>
        <div className="field">
          <label htmlFor="location">Village or town (optional)</label>
          <input id="location" value={form.location} onChange={set("location")} />
        </div>
        <button className="btn" disabled={busy} style={{ width: "100%" }}>
          {busy ? "Creating account..." : "Create account"}
        </button>
        <p style={{ marginTop: "1rem", marginBottom: 0 }}>
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
