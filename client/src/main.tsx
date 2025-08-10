import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage.tsx";
import CadastroUsuarioPage from "./features/auth/pages/CadastroUsuarioPage.tsx";
import EsqueceuSenhaPage from "./features/auth/pages/EsqueceuSenhaPage.tsx";
import Erro404Page from "./pages/errors/Erro404Page.tsx";
import RotaProtegida from "./routes/RotaProtegida.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import DashboardLayout from "./features/dashboard/components/DashboardLayout.tsx";
import "./index.css";
import { Toaster } from "sonner";
import HomePage from "./features/home/pages/HomePage.tsx";
import SobrePage from "./features/home/pages/SobrePage.tsx";
import DetalhesLesaoPage from "./features/lesoes/pages/DetalhesLesaoPage.tsx";
import HistoricoLesaoPage from "./features/lesoes/pages/HistoricoLesaoPage.tsx";
import DetalhesPacientePage from "./features/pacientes/pages/DetalhesPacientePage.tsx";
import PacientesPage from "./features/pacientes/pages/PacientesPage.tsx";
import PerfilPage from "./features/usuarios/pages/PerfilPage.tsx";
import AcessoNegadoPage from "./pages/errors/AcessoNegadoPage.tsx";
import RotaPublica from "./routes/RotaPublica.tsx";
import FormLesaoPage from "./features/lesoes/pages/FormLesaoPage.tsx";

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
              element={<FormLesaoPage />}
            />
            <Route
              path="pacientes/:id_paciente/lesoes/:id_lesao/editar"
              element={<FormLesaoPage />}
            />
            <Route
              path="pacientes/:id_paciente/lesoes/:id_lesao/detalhes"
              element={<DetalhesLesaoPage />}
            />
            <Route
              path="pacientes/:id_paciente/lesoes/:id_lesao/historico"
              element={<HistoricoLesaoPage />}
            />
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
