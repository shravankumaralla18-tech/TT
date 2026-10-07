import { useState } from "react";
import Alert from "../components/Alert.jsx";
import useAuth from "../hooks/useAuth";
import { updateProfile } from "../services/authService";
import { errorMessage } from "../utils/helpers";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, location: user.location || "", phone: user.phone || "" });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });
    try {
      setUser(await updateProfile({ name: form.name, location: form.location || null, phone: form.phone || null }));
      setMsg({ type: "success", text: "Profile saved." });
    } catch (err) {
      setMsg({ type: "error", text: errorMessage(err, "Could not save your profile.") });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="page-head"><h1>Profile</h1></div>
      <form className="card" onSubmit={save} style={{ maxWidth: 480 }}>
        <Alert type={msg.type || "error"}>{msg.text}</Alert>
        <div className="field"><label htmlFor="email">Email</label><input id="email" value={user.email} disabled /></div>
        <div className="field"><label htmlFor="name">Full name</label><input id="name" required minLength={2} value={form.name} onChange={set("name")} /></div>
        <div className="field"><label htmlFor="location">Village or town</label><input id="location" value={form.location} onChange={set("location")} /></div>
        <div className="field"><label htmlFor="phone">Phone</label><input id="phone" type="tel" value={form.phone} onChange={set("phone")} /></div>
        <button className="btn" disabled={busy}>{busy ? "Saving..." : "Save changes"}</button>
      </form>
    </>
  );
}
