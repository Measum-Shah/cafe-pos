import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "../utils/constants";

/* Pages */
import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Categories from "../pages/admin/Categories";
import Products from "../pages/admin/Products";
import Reports from "../pages/admin/Reports";
import POS from "../pages/employee/POS";
import SalesHistory from "../pages/employee/SalesHistory";

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN ONLY */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* ADMIN + EMPLOYEE */}
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.EMPLOYEE]}>
            <Categories />
          </ProtectedRoute>
        }
      />
       <Route
        path="/categories"
        element={
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}>
            <Categories />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Products />
          </ProtectedRoute>
        }
      />
        <Route
        path="/products"
        element={
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}>
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pos"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.EMPLOYEE]}>
            <POS />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sales"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.EMPLOYEE]}>
            <SalesHistory />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default AppRoutes;
