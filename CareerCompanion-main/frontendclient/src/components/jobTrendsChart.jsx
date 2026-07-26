import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const JobTrendsChart = ({ data }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <h2 className="text-lg font-semibold mb-3 text-center text-blue-600">Job Market Trends</h2>
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="#93C5FD" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default JobTrendsChart;



