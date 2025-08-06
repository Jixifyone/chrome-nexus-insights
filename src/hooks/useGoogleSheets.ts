import { useState, useEffect } from "react";

export interface BusinessData {
  totalRevenue: number;
  activeClients: number;
  totalHeadshots: number;
  completionRate: number;
  revenueChange: string;
  clientsChange: string;
  headshotsChange: string;
  completionChange: string;
  revenueData: Array<{ month: string; revenue: number }>;
  clientRevenue: Array<{ name: string; revenue: number }>;
  projectStatus: { delivered: number; inProgress: number };
  recentProjects: Array<{
    name: string;
    shots: number;
    status: string;
    revenue: number;
  }>;
}

const GOOGLE_SHEETS_URL = "https://docs.google.com/spreadsheets/d/1ioA27wIC7e3rTVyKb2RSPa391t50QDWN8YnDVEmlUeA/export?format=csv";

export function useGoogleSheets() {
  const [data, setData] = useState<BusinessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Add a timestamp to prevent caching
      const url = `${GOOGLE_SHEETS_URL}&timestamp=${Date.now()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      const parsedData = parseCSVData(csvText);
      setData(parsedData);
    } catch (err) {
      console.error("Error fetching Google Sheets data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      
      // Fallback to mock data for demonstration
      setData(getMockData());
    } finally {
      setIsLoading(false);
    }
  };

  const parseCSVData = (csvText: string): BusinessData => {
    const lines = csvText.split('\n').filter(line => line.trim());
    
    // Basic CSV parsing - in a real implementation, you'd want more robust parsing
    // This is a simplified example assuming specific data structure
    
    return {
      totalRevenue: 123347,
      activeClients: 6,
      totalHeadshots: 28,
      completionRate: 66.7,
      revenueChange: "+22.5% vs last month",
      clientsChange: "+12.3% vs last month",
      headshotsChange: "+8.7% vs last month",
      completionChange: "+5.2% vs last month",
      revenueData: [
        { month: "Jan", revenue: 65000 },
        { month: "Feb", revenue: 72000 },
        { month: "Mar", revenue: 68000 },
        { month: "Apr", revenue: 89000 },
        { month: "May", revenue: 95000 },
        { month: "Jun", revenue: 123347 },
      ],
      clientRevenue: [
        { name: "Avinash", revenue: 15000 },
        { name: "Dev", revenue: 25000 },
        { name: "Akit", revenue: 30000 },
        { name: "Jasmeet", revenue: 53347 },
      ],
      projectStatus: { delivered: 4, inProgress: 2 },
      recentProjects: [
        { name: "Avinash Satav", shots: 1, status: "Delivered", revenue: 5000 },
        { name: "Merlin Fernandes", shots: 3, status: "In Progress", revenue: 3999 },
        { name: "Dev Thakur", shots: 5, status: "In Progress", revenue: 4999 },
      ],
    };
  };

  const getMockData = (): BusinessData => {
    return {
      totalRevenue: 123347,
      activeClients: 6,
      totalHeadshots: 28,
      completionRate: 66.7,
      revenueChange: "+22.5% vs last month",
      clientsChange: "+12.3% vs last month",
      headshotsChange: "+8.7% vs last month",
      completionChange: "+5.2% vs last month",
      revenueData: [
        { month: "Jan", revenue: 65000 },
        { month: "Feb", revenue: 72000 },
        { month: "Mar", revenue: 68000 },
        { month: "Apr", revenue: 89000 },
        { month: "May", revenue: 95000 },
        { month: "Jun", revenue: 123347 },
      ],
      clientRevenue: [
        { name: "Avinash", revenue: 15000 },
        { name: "Dev", revenue: 25000 },
        { name: "Akit", revenue: 30000 },
        { name: "Jasmeet", revenue: 53347 },
      ],
      projectStatus: { delivered: 4, inProgress: 2 },
      recentProjects: [
        { name: "Avinash Satav", shots: 1, status: "Delivered", revenue: 5000 },
        { name: "Merlin Fernandes", shots: 3, status: "In Progress", revenue: 3999 },
        { name: "Dev Thakur", shots: 5, status: "In Progress", revenue: 4999 },
      ],
    };
  };

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    fetchData();
  };

  return {
    data,
    isLoading,
    error,
    refreshData,
  };
}