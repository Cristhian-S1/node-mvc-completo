import { Router } from "express";
import { UsuarioController } from "../controllers/usuarios.js";

export const usuariosRouter = Router();

// Registro de nuevo usuario
usuariosRouter.post("/registro", UsuarioController.registro);

// Login de usuario
usuariosRouter.post("/login", UsuarioController.login);

// Obtener todos los usuarios
usuariosRouter.get("/", UsuarioController.getAll);

// Obtener un usuario por ID
usuariosRouter.get("/:id", UsuarioController.getById);

// Actualizar un usuario
usuariosRouter.patch("/:id", UsuarioController.update);

// Eliminar un usuario
usuariosRouter.delete("/:id", UsuarioController.delete);
