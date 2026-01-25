import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";

import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  BarChart3,
  History,
  MonitorPlay,
  LogOut,
  Coffee
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const role = user.role?.toLowerCase();
  const isAdmin = role === ROLES.ADMIN;
  const isEmployee = role === ROLES.EMPLOYEE;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ---------- NAV ITEM ---------- */
  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex flex-col items-center justify-center w-full py-5 px-2 transition-all duration-200 group
        ${
          isActive
            ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10 border-r-4 border-[var(--color-primary)]"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-light)]"
        }`}
      >
        {/* ICON SIZE INCREASED TO 28 */}
        <Icon
          size={28}
          className={`mb-2 group-hover:scale-110 transition-transform ${
            isActive ? "scale-110" : ""
          }`}
        />
        {/* TEXT SIZE INCREASED TO text-xs (12px) */}
        <span className="text-xs font-bold tracking-tight text-center">
          {label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="h-screen w-24 bg-[var(--color-bg-card)] border-r border-[var(--color-border)] flex flex-col items-center py-8 shadow-2xl fixed left-0 top-0 z-50">

      {/* LOGO SECTION */}
      <div className="mb-12 text-[var(--color-primary)] bg-[var(--color-primary)]/10 p-4 rounded-2xl shadow-inner">
        <Coffee size={36} strokeWidth={2.5} />
      </div>

      {/* LINKS SECTION */}
      <div className="flex-1 w-full flex flex-col items-center gap-1 overflow-y-auto custom-scrollbar">
        {isAdmin && (
          <>
            <NavItem to="/admin" icon={LayoutDashboard} label="Home" />
            <NavItem to="/admin/products" icon={Package} label="Items" />
            <NavItem to="/admin/categories" icon={Tags} label="Types" />
            <NavItem to="/admin/users" icon={Users} label="Staff" />
            <NavItem to="/admin/reports" icon={BarChart3} label="Reports" />
            <NavItem to="/sales" icon={History} label="History" />
            <NavItem to="/pos" icon={MonitorPlay} label="POS" />
          </>
        )}

        {isEmployee && (
          <>
            <NavItem to="/pos" icon={MonitorPlay} label="POS" />
            <NavItem to="/products" icon={Package} label="Items" />
            <NavItem to="/categories" icon={Tags} label="Types" />
           
          </>
        )}
      </div>

      {/* EXIT BUTTON */}
      <div className="w-full px-2 mt-auto pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex flex-col items-center justify-center py-5 text-[var(--color-danger)] hover:bg-red-500/10 rounded-2xl transition-colors group"
        >
          <LogOut
            size={28}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="text-xs font-black mt-2">EXIT</span>
        </button>
      </div>

    </nav>
  );
};

export default Navbar;