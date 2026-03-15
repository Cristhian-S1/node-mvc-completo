import { pool } from "../../config/database.js";

export class PublicacionModel {
  static async getAll({ fo_id, us_id, estado }) {
    try {
      let query = `
        SELECT p.*, 
               u.us_nombre, 
               u.us_apellido,
               f.fo_titulo
        FROM publicacion p
        LEFT JOIN usuarios u ON p.us_id = u.us_id
        LEFT JOIN foro f ON p.fo_id = f.fo_id
        WHERE p.pu_eliminacion = false
      `;
      const params = [];
      let paramCount = 1;

      if (fo_id) {
        query += ` AND p.fo_id = $${paramCount}`;
        params.push(fo_id);
        paramCount++;
      }

      if (us_id) {
        query += ` AND p.us_id = $${paramCount}`;
        params.push(us_id);
        paramCount++;
      }

      if (estado !== undefined) {
        query += ` AND p.pu_estado = $${paramCount}`;
        params.push(estado);
        paramCount++;
      }

      query += " ORDER BY p.pu_fecha DESC";

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  }

  static async getById({ id }) {
    try {
      const query = `
        SELECT p.*, 
               u.us_nombre, 
               u.us_apellido,
               f.fo_titulo
        FROM publicacion p
        LEFT JOIN usuarios u ON p.us_id = u.us_id
        LEFT JOIN foro f ON p.fo_id = f.fo_id
        WHERE p.pu_id = $1 AND p.pu_eliminacion = false
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
  }

  static async create({ input }) {
    try {
      const {
        pu_titulo,
        pu_descripcion,
        pu_image,
        pu_fecha = new Date().toISOString().split("T")[0],
        pu_eliminacion = false,
        pu_estado = false,
        us_id,
        fo_id,
      } = input;

      const query = `
        INSERT INTO publicacion (
          pu_titulo,
          pu_descripcion,
          pu_image,
          pu_fecha,
          pu_eliminacion,
          pu_estado,
          us_id,
          fo_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const values = [
        pu_titulo,
        pu_descripcion,
        pu_image,
        pu_fecha,
        pu_eliminacion,
        pu_estado,
        us_id,
        fo_id,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }

  static async update({ id, input }) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      for (const [key, value] of Object.entries(input)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }

      if (fields.length === 0) {
        return null;
      }

      values.push(id);

      const query = `
        UPDATE publicacion
        SET ${fields.join(", ")}
        WHERE pu_id = $${paramCount} AND pu_eliminacion = false
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  }

  static async delete({ id }) {
    try {
      // Soft delete
      const query = `
        UPDATE publicacion
        SET pu_eliminacion = true
        WHERE pu_id = $1
        RETURNING pu_id
      `;
      const result = await pool.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }
}
