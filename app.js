import express from "express";
import { publicacionesRouter } from "./routes/publicaciones.js";
import { usuariosRouter } from "./routes/usuarios.js";
import { corsMiddleware } from "./middlewares/cors.js";

const app = express();

// Middlewares globales
app.use(corsMiddleware());
app.use(express.json());
app.disable("x-powered-by");

// Rutas
app.use("/publicaciones", publicacionesRouter);
app.use("/usuarios", usuariosRouter);

// Ruta de healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
