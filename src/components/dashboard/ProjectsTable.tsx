import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProjectRecord } from "@/hooks/useGoogleSheets";
import { Search } from "lucide-react";

interface ProjectsTableProps {
  projects: ProjectRecord[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceRangeFilter, setPriceRangeFilter] = useState("all");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.projectType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         project.status.toLowerCase().includes(statusFilter.toLowerCase());
    
    const matchesPriceRange = priceRangeFilter === "all" || 
      (priceRangeFilter === "low" && project.price < 5000) ||
      (priceRangeFilter === "medium" && project.price >= 5000 && project.price < 15000) ||
      (priceRangeFilter === "high" && project.price >= 15000);

    return matchesSearch && matchesStatus && matchesPriceRange;
  });

  const getStatusBadgeVariant = (status: string) => {
    if (status.toLowerCase().includes('delivered')) return 'default';
    if (status.toLowerCase().includes('progress')) return 'secondary';
    return 'outline';
  };

  const getPaymentStatusVariant = (status: string) => {
    if (status.toLowerCase() === 'paid') return 'default';
    if (status.toLowerCase() === 'partial') return 'secondary';
    if (status.toLowerCase() === 'pending') return 'destructive';
    return 'outline';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by client, email, or project type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="progress">In Progress</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceRangeFilter} onValueChange={setPriceRangeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="low">Under ₹5,000</SelectItem>
            <SelectItem value="medium">₹5,000 - ₹15,000</SelectItem>
            <SelectItem value="high">Above ₹15,000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Headshots</TableHead>
              <TableHead className="font-semibold">Price</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Payment</TableHead>
              <TableHead className="font-semibold">Project Type</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Rating</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project, index) => (
              <TableRow 
                key={index} 
                className="hover:bg-muted/30 transition-colors cursor-pointer group"
              >
                <TableCell className="font-medium group-hover:text-primary transition-colors">
                  <div>
                    <div className="font-semibold">{project.client}</div>
                    <div className="text-xs text-muted-foreground">{project.email}</div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="group-hover:border-primary transition-colors">
                    {project.headshots}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  ₹{project.price.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getStatusBadgeVariant(project.status)}
                    className="group-hover:shadow-md transition-shadow"
                  >
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPaymentStatusVariant(project.paymentStatus)}>
                    {project.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {project.projectType}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {project.location}
                </TableCell>
                <TableCell>
                  {project.rating > 0 ? (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{project.rating}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {project.date ? new Date(project.date).toLocaleDateString() : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No projects found matching your filters.
          </div>
        )}
      </div>
      
      <div className="text-sm text-muted-foreground">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>
    </div>
  );
}