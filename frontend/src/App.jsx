import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.jsx";
import { Login } from "./pages/Login.jsx";
import { UserDashboard } from "./pages/UserDashboard.jsx";
import { MentorDashboard } from "./pages/MentorDashboard.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { ROLES } from "./utils/constants.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/user"
          element={
            <ProtectedRoute requiredRole={ROLES.USER}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor"
          element={
            <ProtectedRoute requiredRole={ROLES.MENTOR}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
