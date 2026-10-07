import { NavLink } from "react-router-dom";

const groups = [
  { title: null, links: [["/", "Dashboard"]] },
  { title: "Crop health", links: [["/disease", "Check a leaf"], ["/disease/history", "Past checks"]] },
  { title: "Market", links: [["/market", "Sell or hold"], ["/market/prices", "Prices"], ["/market/trends", "Price trends"]] },
  { title: "Advice", links: [["/advisory", "Crop advice"], ["/advisory/recommendations", "This month"]] },
  { title: "Account", links: [["/profile", "Profile"]] },
];

export default function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Main">
      {groups.map((g) => (
        <div key={g.title || "top"}>
          {g.title && <div className="group">{g.title}</div>}
          {g.links.map(([to, label]) => (
            <NavLink key={to} to={to} end>
              {label}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}
