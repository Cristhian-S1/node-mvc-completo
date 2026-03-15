import { UsuarioModel } from "../models/postgresql/usuario.js";
import {
  validateUsuario,
  validatePartialUsuario,
  validateLogin,
} from "../schemas/usuario.js";

export class UsuarioController {
  static async registro(req, res) {
    try {
      const result = validateUsuario(req.body);

      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }

      const newUsuario = await UsuarioModel.create({ input: result.data });

      // No devolver la contraseña en la respuesta
      const { us_contrasena, ...usuarioSinPassword } = newUsuario;

      res.status(201).json(usuarioSinPassword);
    } catch (error) {
      console.error("Error en registro:", error);

      if (error.code === "23505") {
        // Duplicate key error
        return res.status(409).json({ error: "El email ya está registrado" });
      }

      res.status(500).json({ error: "Error al registrar el usuario" });
    }
  }

  static async login(req, res) {
    try {
      const result = validateLogin(req.body);

      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }

      const usuario = await UsuarioModel.login(result.data);

      if (!usuario) {
        return res
          .status(401)
          .json({ error: "Email o contraseña incorrectos" });
      }

      // No devolver la contraseña en la respuesta
      const { us_contrasena, ...usuarioSinPassword } = usuario;

      res.json({
        message: "Login exitoso",
        usuario: usuarioSinPassword,
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  }

  static async getAll(req, res) {
    try {
      const usuarios = await UsuarioModel.getAll();
      res.json(usuarios);
    } catch (error) {
      console.error("Error getting usuarios:", error);
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioModel.getById({ id });

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json(usuario);
    } catch (error) {
      console.error("Error getting usuario:", error);
      res.status(500).json({ error: "Error al obtener el usuario" });
    }
  }

  static async update(req, res) {
    try {
      const result = validatePartialUsuario(req.body);

      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }

      const { id } = req.params;
      const updatedUsuario = await UsuarioModel.update({
        id,
        input: result.data,
      });

      if (!updatedUsuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json(updatedUsuario);
    } catch (error) {
      console.error("Error updating usuario:", error);
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await UsuarioModel.delete({ id });

      if (!result) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error("Error deleting usuario:", error);
      res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  }
}
