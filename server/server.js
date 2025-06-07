import "dotenv/config";
import express from "express";
import AuthRoutes from "./routes/AuthRoutes.js";
import UsuarioRoutes from "./routes/UsuarioRoutes.js";
import patientRoutes from "./routes/PacienteRoutes.js";
import LesaoRoutes from "./routes/LesaoRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", AuthRoutes);
app.use("/api/usuarios", UsuarioRoutes);
app.use("/api/pacientes", patientRoutes);
app.use("/api/lesoes", LesaoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
