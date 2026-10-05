import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { DashboardProvider } from "../context/DashboardContext";

import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsGrid from "../components/dashboard/StatsGrid";
import RecentActivity from "../components/dashboard/RecentActivity";
import AMRAnalyticsChart from "../components/dashboard/AMRAnalyticsChart";

import "../styles/dashboard.css";


function Dashboard() {
  return (
    <div className="dashboard">

      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}
      <Navbar />


      {/* =====================================================
          DASHBOARD BODY
      ===================================================== */}
      <div className="dashboard-body">

        {/* SIDEBAR */}
        <Sidebar />


        {/* MAIN CONTENT */}
        <main className="dashboard-content">

          {/* All dashboard widgets share the dashboard API data */}
          <DashboardProvider>

            {/* =================================================
                WELCOME SECTION
            ================================================= */}
            <section className="dashboard-welcome">
              <WelcomeCard />
            </section>


            {/* =================================================
                KPI / STATISTICS SECTION
            ================================================= */}
            <section className="dashboard-stats">
              <StatsGrid />
            </section>


            {/* =================================================
                ACTIVITY + ANALYTICS ROW
            ================================================= */}
            <section className="dashboard-lower-grid">

              {/* Recent clinical activity */}
              <div className="dashboard-activity">
                <RecentActivity />
              </div>


              {/* AMR analytics */}
              <div className="dashboard-analytics">
                <AMRAnalyticsChart />
              </div>

            </section>

          </DashboardProvider>

        </main>

      </div>

    </div>
  );
}


export default Dashboard;