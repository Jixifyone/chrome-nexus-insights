import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  description?: string;
}

export function ChartCard({
  title,
  children,
  className,
  isLoading = false,
  description
}: ChartCardProps) {
  return (
    <Card className={cn(
      "glass-card p-6 relative overflow-hidden group",
      isLoading && "pulse-glow",
      className
    )}>
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        <div className="relative">
          {children}
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