import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patient from "./pages/Patient";
import Clinical from "./pages/Clinical";
import Prediction from "./pages/Prediction";
import Recommendation from "./pages/Recommendation";
import Report from "./pages/Report";
import PredictionHistory from "./pages/PredictionHistory";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient"
        element={
          <ProtectedRoute>
            <Patient />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <Patient />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clinical"
        element={
          <ProtectedRoute>
            <Clinical />
          </ProtectedRoute>
        }
      />

      <Route
        path="/prediction-history"
        element={
          <ProtectedRoute>
            <PredictionHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/prediction"
        element={
          <ProtectedRoute>
            <Prediction />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recommendation"
        element={
          <ProtectedRoute>
            <Recommendation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;