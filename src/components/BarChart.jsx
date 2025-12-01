import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function BarChartComponent({ data = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full">
      <h3 className="text-gray-700 mb-4 font-medium">Jumlah Panen per Minggu</h3>
      <BarChart width={500} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="jumlah" fill="#16a34a" radius={[5, 5, 0, 0]} />
      </BarChart>
    </div>
  );
}
