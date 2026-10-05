import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

// ============================================================
// Dashboard Context
// Centralises the single /dashboard/ API call so that
// StatsGrid, RecentActivity, AnalyticsPlaceholder, and the
// new TopRiskPatients widget all share the same data without
// making redundant network requests.
// ============================================================

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard/");
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <DashboardContext.Provider value={{ data, loading, error, refresh }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }
  return ctx;
}

export default DashboardContext;
