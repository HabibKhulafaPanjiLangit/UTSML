import { ChartContainer } from '../../components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
export default function LazyChart({ data }: { data: { x: number; y: number }[] }) {
  return (
    <ChartContainer config={{}}>
      <LineChart data={data} width={600} height={300}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#3b82f6" />
      </LineChart>
    </ChartContainer>
  );
}