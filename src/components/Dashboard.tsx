import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Users, Camera, Target, Package } from "lucide-react";
import { MetricCard } from "./dashboard/MetricCard";
import { ChartCard } from "./dashboard/ChartCard";
import { Chatbot } from "./dashboard/Chatbot";
import { ProjectsTable } from "./dashboard/ProjectsTable";
import { RevenueTrendChart } from "./charts/RevenueTrendChart";
import { ClientRevenueChart } from "./charts/ClientRevenueChart";
import { ProjectStatusChart } from "./charts/ProjectStatusChart";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const { data, isLoading, error, refreshData } = useGoogleSheets();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    refreshData();
    setLastRefresh(new Date());
  };

  const handleChatbotDataUpdate = (newData: any) => {
    // This could trigger a refresh or update specific data
    refreshData();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={handleRefresh} className="bg-primary/20 hover:bg-primary/30">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-6 custom-scrollbar">
      <div className="max-w-[1600px] mx-auto">
        {/* Header - Compact for landscape */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-2">
                <span className="gradient-primary bg-clip-text text-transparent">
                  Business Analytics Hub
                </span>
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Live Data</span>
                </div>
                <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
              </div>
            </div>
            
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </header>

        {/* KPI Metrics Grid - Optimized for landscape */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-6">
          <MetricCard
            title="Total Revenue"
            value={`₹${data?.totalRevenue.toLocaleString() || "0"}`}
            change={data?.revenueChange || ""}
            changeType="positive"
            icon={<TrendingUp className="w-5 h-5" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Active Clients"
            value={data?.activeClients.toString() || "0"}
            change={data?.clientsChange || ""}
            changeType="positive"
            icon={<Users className="w-5 h-5" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Total Headshots"
            value={data?.totalHeadshots.toString() || "0"}
            change={data?.headshotsChange || ""}
            changeType="positive"
            icon={<Camera className="w-5 h-5" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Delivered Projects"
            value={data?.deliveredProjects.toString() || "0"}
            change={data?.deliveredChange || ""}
            changeType="positive"
            icon={<Package className="w-5 h-5" />}
            isLoading={isLoading}
          />
          <MetricCard
            title="Avg Revenue per Client"
            value={`₹${Math.round(data?.avgRevenuePerClient || 0).toLocaleString()}`}
            change="+15.2% vs last month"
            changeType="positive"
            icon={<Target className="w-5 h-5" />}
            isLoading={isLoading}
          />
        </div>

        {/* Charts Grid - Perfect for landscape mode like the reference */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-6">
          <ChartCard
            title="Cumulative Revenue Growth"
            description="Monthly revenue growth over time"
            isLoading={isLoading}
            className="xl:col-span-1"
          >
            {data?.revenueData && (
              <RevenueTrendChart data={data.revenueData} />
            )}
          </ChartCard>

          <ChartCard
            title="Revenue by Client"
            description="Revenue breakdown by client"
            isLoading={isLoading}
            className="xl:col-span-1"
          >
            {data?.clientRevenue && (
              <ClientRevenueChart data={data.clientRevenue} />
            )}
          </ChartCard>

          <ChartCard
            title="Project Status Distribution"
            description="Delivered vs In Progress projects"
            isLoading={isLoading}
            className="xl:col-span-1"
          >
            {data?.projectStatus && (
              <ProjectStatusChart data={data.projectStatus} />
            )}
          </ChartCard>
        </div>

        {/* Projects Table */}
        <div className="mb-6">
          <ChartCard
            title="Projects Overview"
            description="Complete project data with filters and search"
            isLoading={isLoading}
          >
            {data?.projects && (
              <ProjectsTable projects={data.projects} />
            )}
          </ChartCard>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot onDataUpdate={handleChatbotDataUpdate} />
    </div>
  );
}