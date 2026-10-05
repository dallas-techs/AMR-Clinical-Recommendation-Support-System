import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Supports both:
  // <ProtectedRoute><Dashboard /></ProtectedRoute>
  // and
  // <Route element={<ProtectedRoute />}><Route ... /></Route>
  if (children) {
    return children;
  }

  return <Outlet />;
}

export default ProtectedRoute;