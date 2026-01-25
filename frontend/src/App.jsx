import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import "./index.css"; // Tailwind + CSS variables

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
