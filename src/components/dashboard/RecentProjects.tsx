import { Badge } from "@/components/ui/badge";
import { Camera, TrendingUp } from "lucide-react";

interface Project {
  name: string;
  shots: number;
  status: string;
  revenue: number;
}

interface RecentProjectsProps {
  projects: Project[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">{project.name}</h4>
              <p className="text-sm text-muted-foreground">{project.shots} shots</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-mono text-sm neon-cyan">₹{project.revenue.toLocaleString()}</p>
            </div>
            <Badge
              variant={project.status === "Delivered" ? "default" : "secondary"}
              className={
                project.status === "Delivered"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-orange-500/20 text-orange-400 border-orange-500/30"
              }
            >
              {project.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}