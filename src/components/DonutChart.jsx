import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#16a34a", "#ef4444"];

export default function DonutChart({ healthy = 0, sick = 0 }) {
  const data = [
    { name: "Sehat", value: healthy },
    { name: "Sakit", value: sick },
  ];

  const total = healthy + sick;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full">
      <h3 className="text-gray-700 mb-4 font-medium">Perbandingan Kesehatan Pohon</h3>
      <PieChart width={250} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
      <p className="text-center text-sm text-gray-500 mt-2">
        Total: <span className="font-semibold text-gray-700">{total}</span>
      </p>
    </div>
  );
}
