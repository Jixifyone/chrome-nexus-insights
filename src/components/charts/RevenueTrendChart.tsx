import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface RevenueTrendChartProps {
  data: Array<{ month: string; revenue: number }>;
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `₹${value/1000}k`}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--neon-cyan))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--neon-cyan))", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: "hsl(var(--neon-cyan))", strokeWidth: 2 }}
            filter="drop-shadow(0px 0px 6px hsl(var(--neon-cyan) / 0.6))"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}