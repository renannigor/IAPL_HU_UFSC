import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/authentication/LoginPage";
import CadastroUsuarioPage from "./pages/authentication/CadastroUsuarioPage.tsx";
import EsqueceuSenhaPage from "./pages/authentication/EsqueceuSenhaPage.tsx";
import RedefinirSenhaPage from "./pages/authentication/RedefinirSenhaPage.tsx";
import Erro404Page from "./pages/Erro404Page.tsx";
import AcessoNegadoPage from "./pages/AcessoNegadoPage.tsx";
import RotaProtegida from "./components/auth/RotaProtegida.tsx";
import RotaPublica from "./components/auth/RotaPublica.tsx";
import { AuthProvider } from "./components/auth/AuthProvider.tsx";
import DashboardLayout from "./pages/dashboard/components/DashboardLayout.tsx";
import HomePage from "./pages/dashboard/HomePage";
import PerfilPage from "./pages/dashboard/PerfilPage";
import UsuariosPage from "./pages/dashboard/UsuariosPage";
import PacientesPage from "./pages/dashboard/PacientesPage";
import SobrePage from "./pages/dashboard/SobrePage";
import "./index.css";
import DetalhesPacientePage from "./pages/dashboard/DetalhesPacientePage.tsx";
import DetalhesLesaoPage from "./pages/dashboard/DetalhesLesaoPage.tsx";
import LesaoFormPage from "./pages/dashboard/LesaoFormPage.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Rotas públicas - bloqueadas para usuários logados */}
          <Route
            path="/"
            element={
              <RotaPublica>
                <LoginPage />
              </RotaPublica>
            }
          />
          <Route
            path="/entrar"
            element={
              <RotaPublica>
                <LoginPage />
              </RotaPublica>
            }
          />
          <Route
            path="/cadastrar"
            element={
              <RotaPublica>
                <CadastroUsuarioPage />
              </RotaPublica>
            }
          />
          <Route
            path="/esqueceu-senha"
            element={
              <RotaPublica>
                <EsqueceuSenhaPage />
              </RotaPublica>
            }
          />

          <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

          {/* Rotas protegidas */}
          <Route path="/sem-acesso" element={<AcessoNegadoPage />} />
          <Route
            path="/dashboard"
            element={
              <RotaProtegida>
                <DashboardLayout />
              </RotaProtegida>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="pacientes" element={<PacientesPage />} />
            <Route path="pacientes/:id" element={<DetalhesPacientePage />} />
            <Route
              path="pacientes/:id_paciente/lesoes/cadastrar"
              element={<LesaoFormPage />}
            />
            <Route
              path="pacientes/:id_paciente/lesoes/:id_lesao/editar"
              element={<LesaoFormPage />}
            />
            <Route
              path="pacientes/:id_paciente/lesoes/:id_lesao/detalhes"
              element={<DetalhesLesaoPage />}
            />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="perfil" element={<PerfilPage />} />
            <Route path="sobre" element={<SobrePage />} />
          </Route>

          {/* Página 404 */}
          <Route path="*" element={<Erro404Page />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
