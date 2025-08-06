import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  className,
  isLoading = false
}: MetricCardProps) {
  const changeColorClass = {
    positive: "neon-green",
    negative: "text-destructive",
    neutral: "text-muted-foreground"
  }[changeType];

  return (
    <Card className={cn(
      "glass-card p-6 relative overflow-hidden group",
      isLoading && "pulse-glow",
      className
    )}>
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </h3>
          {icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-3xl font-bold neon-cyan font-mono">
            {value}
          </p>
          
          {change && (
            <p className={cn("text-sm flex items-center gap-1", changeColorClass)}>
              <span className="inline-block w-2 h-2 rounded-full bg-current"></span>
              {change}
            </p>
          )}
        </div>
      </div>

      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" 
           style={{ padding: '1px' }}>
        <div className="w-full h-full bg-card rounded-lg" />
      </div>
    </Card>
  );
}