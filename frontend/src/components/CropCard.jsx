export default function CropCard({ crop, selected, onSelect }) {
  return (
    <button
      type="button"
      className="card"
      onClick={() => onSelect?.(crop.id)}
      aria-pressed={selected}
      style={{ textAlign: "left", font: "inherit", cursor: "pointer", borderColor: selected ? "var(--leaf)" : undefined, borderWidth: selected ? 2 : 1 }}
    >
      <h3>{crop.name}</h3>
      <p className="muted" style={{ margin: 0 }}>
        {crop.category} · {crop.water_need} water · {crop.ideal_temp_c[0]}-{crop.ideal_temp_c[1]}°C
      </p>
    </button>
  );
}
