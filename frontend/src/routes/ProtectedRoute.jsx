import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles, children }) => {

  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
