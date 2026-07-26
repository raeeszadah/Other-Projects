import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CareerGrowthChart = ({ data }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <h2 className="text-lg font-semibold mb-3 text-center text-indigo-600">Career Growth Tracker</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#4F46E5" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default CareerGrowthChart;



