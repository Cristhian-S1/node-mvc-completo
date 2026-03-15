import { Router } from "express";
import { PublicacionController } from "../controllers/publicaciones.js";

export const publicacionesRouter = Router();

// Obtener todas las publicaciones (filtradas)
publicacionesRouter.get("/", PublicacionController.getAll);

// Crear una nueva publicación
publicacionesRouter.post("/", PublicacionController.create);

// Obtener detalles de una publicación específica
publicacionesRouter.get("/:id", PublicacionController.getById);

// Actualizar una publicación
publicacionesRouter.patch("/:id", PublicacionController.update);

// Eliminar (soft delete) una publicación
publicacionesRouter.delete("/:id", PublicacionController.delete);
