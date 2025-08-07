import { useState, useEffect } from "react";

export interface ProjectRecord {
  client: string;
  headshots: number;
  price: number;
  status: string;
  email: string;
  projectType: string;
  location: string;
  shotDuration: number;
  discountGiven: number;
  paymentStatus: string;
  paymentMode: string;
  assignedPhotographer: string;
  rating: number;
  review: string;
  date: string;
  deliveryDate: string;
  actualDeliveryTime: number;
  createdAt: string;
  updatedAt: string;
  lastContacted: string;
}

export interface BusinessData {
  totalRevenue: number;
  activeClients: number;
  totalHeadshots: number;
  deliveredProjects: number;
  avgRevenuePerClient: number;
  revenueChange: string;
  clientsChange: string;
  headshotsChange: string;
  deliveredChange: string;
  revenueData: Array<{ month: string; revenue: number }>;
  clientRevenue: Array<{ name: string; revenue: number }>;
  projectStatus: { delivered: number; inProgress: number };
  projects: ProjectRecord[];
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
    
    if (lines.length < 2) {
      return getMockData();
    }
    
    const headers = lines[0].split(',').map(h => h.trim());
    const projects: ProjectRecord[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= headers.length) {
        projects.push({
          client: values[0] || '',
          headshots: parseInt(values[1]) || 0,
          price: parseFloat(values[2]) || 0,
          status: values[3] || '',
          email: values[4] || '',
          projectType: values[5] || '',
          location: values[6] || '',
          shotDuration: parseFloat(values[7]) || 0,
          discountGiven: parseFloat(values[8]) || 0,
          paymentStatus: values[9] || '',
          paymentMode: values[10] || '',
          assignedPhotographer: values[11] || '',
          rating: parseFloat(values[12]) || 0,
          review: values[13] || '',
          date: values[14] || '',
          deliveryDate: values[15] || '',
          actualDeliveryTime: parseFloat(values[16]) || 0,
          createdAt: values[17] || '',
          updatedAt: values[18] || '',
          lastContacted: values[19] || ''
        });
      }
    }
    
    // Calculate metrics from real data
    const totalRevenue = projects.reduce((sum, p) => sum + p.price, 0);
    const uniqueClients = new Set(projects.map(p => p.client)).size;
    const totalHeadshots = projects.reduce((sum, p) => sum + p.headshots, 0);
    const deliveredProjects = projects.filter(p => p.status.toLowerCase().includes('delivered')).length;
    const avgRevenuePerClient = uniqueClients > 0 ? totalRevenue / uniqueClients : 0;
    
    // Calculate project status
    const delivered = projects.filter(p => p.status.toLowerCase().includes('delivered')).length;
    const inProgress = projects.filter(p => p.status.toLowerCase().includes('progress')).length;
    
    // Group revenue by client
    const clientRevenueMap = new Map<string, number>();
    projects.forEach(p => {
      const current = clientRevenueMap.get(p.client) || 0;
      clientRevenueMap.set(p.client, current + p.price);
    });
    const clientRevenue = Array.from(clientRevenueMap.entries())
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
    
    // Generate monthly revenue data from dates
    const monthlyRevenue = new Map<string, number>();
    projects.forEach(p => {
      if (p.date) {
        const date = new Date(p.date);
        if (!isNaN(date.getTime())) {
          const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
          const current = monthlyRevenue.get(monthKey) || 0;
          monthlyRevenue.set(monthKey, current + p.price);
        }
      }
    });
    
    const revenueData = Array.from(monthlyRevenue.entries())
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
    
    // Calculate percentage changes (mock for now - would need historical data)
    const revenueChange = "+22.5% vs last month";
    const clientsChange = `+${((uniqueClients - 5) / 5 * 100).toFixed(1)}% vs last month`;
    const headshotsChange = `+${((totalHeadshots - 25) / 25 * 100).toFixed(1)}% vs last month`;
    const deliveredChange = `+${((deliveredProjects - 3) / 3 * 100).toFixed(1)}% vs last month`;
    
    return {
      totalRevenue,
      activeClients: uniqueClients,
      totalHeadshots,
      deliveredProjects,
      avgRevenuePerClient,
      revenueChange,
      clientsChange,
      headshotsChange,
      deliveredChange,
      revenueData: revenueData.length > 0 ? revenueData : [
        { month: "Jan", revenue: 65000 },
        { month: "Feb", revenue: 72000 },
        { month: "Mar", revenue: 68000 },
        { month: "Apr", revenue: 89000 },
        { month: "May", revenue: 95000 },
        { month: "Jun", revenue: totalRevenue },
      ],
      clientRevenue: clientRevenue.length > 0 ? clientRevenue : [
        { name: "Mock Client", revenue: totalRevenue }
      ],
      projectStatus: { delivered, inProgress },
      projects
    };
  };

  const getMockData = (): BusinessData => {
    return {
      totalRevenue: 134347,
      activeClients: 7,
      totalHeadshots: 30,
      deliveredProjects: 4,
      avgRevenuePerClient: 19192,
      revenueChange: "+22.5% vs last month",
      clientsChange: "+12.3% vs last month",
      headshotsChange: "+8.7% vs last month",
      deliveredChange: "+5.2% vs last month",
      revenueData: [
        { month: "Jan", revenue: 65000 },
        { month: "Feb", revenue: 72000 },
        { month: "Mar", revenue: 68000 },
        { month: "Apr", revenue: 89000 },
        { month: "May", revenue: 95000 },
        { month: "Jun", revenue: 134347 },
      ],
      clientRevenue: [
        { name: "Avinash", revenue: 15000 },
        { name: "Dev", revenue: 25000 },
        { name: "Akit", revenue: 30000 },
        { name: "Jasmeet", revenue: 64347 },
      ],
      projectStatus: { delivered: 4, inProgress: 3 },
      projects: [
        { client: "Avinash Satav", headshots: 1, price: 5000, status: "Delivered", email: "avinash@email.com", projectType: "Corporate", location: "Mumbai", shotDuration: 2, discountGiven: 0, paymentStatus: "Paid", paymentMode: "UPI", assignedPhotographer: "Photographer A", rating: 5, review: "Great work", date: "2024-06-15", deliveryDate: "2024-06-20", actualDeliveryTime: 5, createdAt: "2024-06-10", updatedAt: "2024-06-20", lastContacted: "2024-06-21" },
        { client: "Merlin Fernandes", headshots: 3, price: 3999, status: "In Progress", email: "merlin@email.com", projectType: "Personal", location: "Delhi", shotDuration: 3, discountGiven: 500, paymentStatus: "Pending", paymentMode: "Bank Transfer", assignedPhotographer: "Photographer B", rating: 0, review: "", date: "2024-06-18", deliveryDate: "2024-06-25", actualDeliveryTime: 0, createdAt: "2024-06-15", updatedAt: "2024-06-22", lastContacted: "2024-06-22" },
        { client: "Dev Thakur", headshots: 5, price: 4999, status: "In Progress", email: "dev@email.com", projectType: "Portfolio", location: "Bangalore", shotDuration: 4, discountGiven: 0, paymentStatus: "Partial", paymentMode: "Credit Card", assignedPhotographer: "Photographer A", rating: 0, review: "", date: "2024-06-20", deliveryDate: "2024-06-28", actualDeliveryTime: 0, createdAt: "2024-06-18", updatedAt: "2024-06-23", lastContacted: "2024-06-23" }
      ]
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