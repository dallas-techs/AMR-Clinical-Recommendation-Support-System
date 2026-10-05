import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PsychologyIcon from "@mui/icons-material/Psychology";
import VerifiedIcon from "@mui/icons-material/Verified";
import WarningIcon from "@mui/icons-material/Warning";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import StatCard from "./StatCard";
import { useDashboard } from "../../context/DashboardContext";


function StatsGrid() {
  const { data, loading } = useDashboard();

  const stats = data || {
    total_patients: 0,
    clinical_records: 0,
    total_predictions: 0,
    verified_reports: 0,
    high_risk_cases: 0,
    low_risk_cases: 0,
    pending_verifications: 0,
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
        gap: "16px",
        width: "100%",
      }}
    >

      <StatCard
        title="Total Patients"
        value={loading ? null : stats.total_patients}
        icon={<PeopleIcon />}
        color="#1976D2"
        bgColor="#EBF3FF"
        subtitle="Registered in system"
      />

      <StatCard
        title="Clinical Records"
        value={loading ? null : stats.clinical_records}
        icon={<AssignmentIcon />}
        color="#2E7D32"
        bgColor="#EDFAF0"
        subtitle="Lab & culture data"
      />

      <StatCard
        title="Predictions Run"
        value={loading ? null : stats.total_predictions}
        icon={<PsychologyIcon />}
        color="#E65100"
        bgColor="#FFF3E0"
        subtitle="AI assessments done"
      />

      <StatCard
        title="Verified Reports"
        value={loading ? null : stats.verified_reports}
        icon={<VerifiedIcon />}
        color="#6A1B9A"
        bgColor="#F5EDFC"
        subtitle="Doctor-reviewed"
      />

      <StatCard
        title="High AMR Risk"
        value={loading ? null : stats.high_risk_cases}
        icon={<WarningIcon />}
        color="#C62828"
        bgColor="#FFEBEE"
        subtitle="Requires urgent attention"
        highlight
      />

      <StatCard
        title="Low AMR Risk"
        value={loading ? null : stats.low_risk_cases}
        icon={<TrendingDownIcon />}
        color="#2E7D32"
        bgColor="#E8F5E9"
        subtitle="Stable, monitor routinely"
      />

      <StatCard
        title="Pending Review"
        value={loading ? null : (data?.pending_verifications ?? 0)}
        icon={<PendingActionsIcon />}
        color="#F57C00"
        bgColor="#FFF8E1"
        subtitle="Awaiting doctor sign-off"
      />

    </div>
  );
}


export default StatsGrid;