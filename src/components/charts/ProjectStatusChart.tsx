import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ProjectStatusChartProps {
  data: { delivered: number; inProgress: number };
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const total = data.delivered + data.inProgress;
  const chartData = [
    { 
      name: "Delivered", 
      value: data.delivered, 
      percentage: total > 0 ? ((data.delivered / total) * 100).toFixed(1) : "0",
      color: "hsl(var(--neon-green))" 
    },
    { 
      name: "In Progress", 
      value: data.inProgress, 
      percentage: total > 0 ? ((data.inProgress / total) * 100).toFixed(1) : "0",
      color: "hsl(var(--neon-orange))" 
    },
  ];

  return (
    <div className="h-64 group">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                filter={`drop-shadow(0px 0px 6px ${entry.color}66)`}
                className="transition-all duration-200 hover:brightness-110"
              />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="glass-card p-3 border rounded-lg shadow-lg">
                    <p className="text-sm font-medium">{data.name}</p>
                    <p className="text-sm text-primary">
                      {`Count: ${data.value} (${data.percentage}%)`}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ color: "hsl(var(--foreground))" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}