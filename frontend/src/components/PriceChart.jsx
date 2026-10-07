import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function PriceChart({ data, unit = "quintal" }) {
  return (
    <div style={{ width: "100%", height: 320 }} role="img" aria-label="Line chart of average price over time">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid stroke="#d3dccf" strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} minTickGap={24} />
          <YAxis domain={["auto", "auto"]} width={64} />
          <Tooltip formatter={(v) => [v, `Price per ${unit}`]} labelFormatter={(l) => l} />
          <Line type="monotone" dataKey="price" stroke="#1e4d3a" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
