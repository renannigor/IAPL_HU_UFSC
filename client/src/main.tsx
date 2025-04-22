import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import ResetPasswordPage from "./pages/authentication/ForgotPasswordPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import NoAccessPage from "./pages/NoAccessPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import PublicRoute from "./components/PublicRoute.tsx";
import { AuthProvider } from "./components/AuthProvider.tsx";
import DashboardLayout from "./pages/dashboard/components/DashboardLayout.tsx";
import HomePage from "./pages/dashboard/HomePage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import UsersPage from "./pages/dashboard/UsersPage";
import PatientsPage from "./pages/dashboard/PatientsPage";
import AboutPage from "./pages/dashboard/AboutPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas - bloqueadas para usuários logados */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/entrar"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/cadastrar"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/esqueceu-senha"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />

          {/* Rotas protegidas */}
          <Route path="/sem-acesso" element={<NoAccessPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="pacientes" element={<PatientsPage />} />
            <Route path="usuarios" element={<UsersPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="sobre" element={<AboutPage />} />
          </Route>

          {/* Página 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
