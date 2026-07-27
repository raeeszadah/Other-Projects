import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const SkillMatchChart = ({ data }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <h2 className="text-lg font-semibold mb-3 text-center text-green-600">Skill Match Insights</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="skill" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#10B981" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default SkillMatchChart;




