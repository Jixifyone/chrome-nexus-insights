import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface ClientRevenueChartProps {
  data: Array<{ name: string; revenue: number }>;
}

export function ClientRevenueChart({ data }: ClientRevenueChartProps) {
  return (
    <div className="h-64 group">
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
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass-card p-3 border rounded-lg shadow-lg">
                    <p className="text-sm font-medium">{`Client: ${label}`}</p>
                    <p className="text-sm text-primary">
                      {`Revenue: ₹${payload[0].value?.toLocaleString()}`}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="revenue"
            fill="hsl(var(--neon-purple))"
            radius={[4, 4, 0, 0]}
            filter="drop-shadow(0px 0px 6px hsl(var(--neon-purple) / 0.6))"
            className="transition-all duration-200 hover:opacity-80"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}