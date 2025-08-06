import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface ClientRevenueChartProps {
  data: Array<{ name: string; revenue: number }>;
}

export function ClientRevenueChart({ data }: ClientRevenueChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `₹${value/1000}k`}
          />
          <Bar
            dataKey="revenue"
            fill="hsl(var(--neon-purple))"
            radius={[4, 4, 0, 0]}
            filter="drop-shadow(0px 0px 6px hsl(var(--neon-purple) / 0.6))"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}