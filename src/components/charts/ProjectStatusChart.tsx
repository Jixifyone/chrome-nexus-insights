import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface ProjectStatusChartProps {
  data: { delivered: number; inProgress: number };
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const chartData = [
    { name: "Delivered", value: data.delivered, color: "hsl(var(--neon-green))" },
    { name: "In Progress", value: data.inProgress, color: "hsl(var(--neon-orange))" },
  ];

  return (
    <div className="h-64">
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
              />
            ))}
          </Pie>
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