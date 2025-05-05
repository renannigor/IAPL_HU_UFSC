import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/authentication/ResetPasswordPage.tsx";
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
import PatientDetailsPage from "./pages/dashboard/PatientDetailsPage.tsx";
import LesioFormPage from "./pages/dashboard/LesioFormPage.tsx";

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
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />

          <Route path="/redefinir-senha" element={<ResetPasswordPage />} />

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
            <Route path="pacientes/:id" element={<PatientDetailsPage />} />
            <Route path="pacientes/:id/cadastrar-lesao" element={<LesioFormPage />} />
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
