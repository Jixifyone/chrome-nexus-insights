import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface RevenueTrendChartProps {
  data: Array<{ month: string; revenue: number }>;
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  return (
    <div className="h-64 group">
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
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass-card p-3 border rounded-lg shadow-lg">
                    <p className="text-sm font-medium">{`Month: ${label}`}</p>
                    <p className="text-sm text-primary">
                      {`Revenue: ₹${payload[0].value?.toLocaleString()}`}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--neon-cyan))"
            strokeWidth={3}
            dot={{ 
              fill: "hsl(var(--neon-cyan))", 
              strokeWidth: 2, 
              r: 6,
              className: "transition-all duration-200 group-hover:r-8"
            }}
            activeDot={{ 
              r: 10, 
              stroke: "hsl(var(--neon-cyan))", 
              strokeWidth: 3,
              filter: "drop-shadow(0px 0px 10px hsl(var(--neon-cyan) / 0.8))"
            }}
            filter="drop-shadow(0px 0px 6px hsl(var(--neon-cyan) / 0.6))"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}