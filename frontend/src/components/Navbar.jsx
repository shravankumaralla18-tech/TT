import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <img src="/assets/logo.png" alt="" />
        Crop Advisory
      </Link>
      <div className="who">
        <span>{user?.name}</span>
        <button
          className="btn ghost small"
          style={{ color: "#fff", borderColor: "#fff" }}
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Log out
        </button>
      </div>
    </header>
  );
}
