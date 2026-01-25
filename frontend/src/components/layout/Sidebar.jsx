import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Products", path: "/admin/products" },
    { name: "Reports", path: "/admin/reports" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[color:var(--color-bg-card)] text-[color:var(--color-text-primary)] shadow-lg">
      <div className="p-6 text-2xl font-bold text-[color:var(--color-primary)]">
        Cafe POS
      </div>
      <nav className="mt-6 flex flex-col space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block py-3 px-6 rounded-lg hover:bg-[color:var(--color-bg-light)] ${
                isActive ? "bg-[color:var(--color-bg-light)]" : ""
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
