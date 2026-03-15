import { PublicacionModel } from "../models/postgresql/publicacion.js";
import {
  validatePublicacion,
  validatePartialPublicacion,
} from "../schemas/publicacion.js";

export class PublicacionController {
  static async getAll(req, res) {
    try {
      const { fo_id, us_id, estado } = req.query;
      const publicaciones = await PublicacionModel.getAll({
        fo_id,
        us_id,
        estado,
      });
      res.json(publicaciones);
    } catch (error) {
      console.error("Error getting publicaciones:", error);
      res.status(500).json({ error: "Error al obtener publicaciones" });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const publicacion = await PublicacionModel.getById({ id });

      if (!publicacion) {
        return res.status(404).json({ message: "Publicación no encontrada" });
      }

      res.json(publicacion);
    } catch (error) {
      console.error("Error getting publicacion:", error);
      res.status(500).json({ error: "Error al obtener la publicación" });
    }
  }

  static async create(req, res) {
    try {
      const result = validatePublicacion(req.body);

      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }

      const newPublicacion = await PublicacionModel.create({
        input: result.data,
      });
      res.status(201).json(newPublicacion);
    } catch (error) {
      console.error("Error creating publicacion:", error);
      res.status(500).json({ error: "Error al crear la publicación" });
    }
  }

  static async update(req, res) {
    try {
      const result = validatePartialPublicacion(req.body);

      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }

      const { id } = req.params;
      const updatedPublicacion = await PublicacionModel.update({
        id,
        input: result.data,
      });

      if (!updatedPublicacion) {
        return res.status(404).json({ message: "Publicación no encontrada" });
      }

      res.json(updatedPublicacion);
    } catch (error) {
      console.error("Error updating publicacion:", error);
      res.status(500).json({ error: "Error al actualizar la publicación" });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await PublicacionModel.delete({ id });

      if (!result) {
        return res.status(404).json({ message: "Publicación no encontrada" });
      }

      res.json({ message: "Publicación eliminada correctamente" });
    } catch (error) {
      console.error("Error deleting publicacion:", error);
      res.status(500).json({ error: "Error al eliminar la publicación" });
    }
  }
}
