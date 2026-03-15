import { pool } from "../../config/database.js";

export class UsuarioModel {
  static async getAll() {
    try {
      const query = `
        SELECT us_id, us_nombre, us_apellido, us_email, us_contacto
        FROM usuarios
        ORDER BY us_id
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  }

  static async getById({ id }) {
    try {
      const query = `
        SELECT us_id, us_nombre, us_apellido, us_email, us_contacto
        FROM usuarios
        WHERE us_id = $1
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
      const { us_nombre, us_apellido, us_email, us_contrasena, us_contacto } =
        input;

      const query = `
        INSERT INTO usuarios (
          us_nombre,
          us_apellido,
          us_email,
          us_contrasena,
          us_contacto
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const values = [
        us_nombre,
        us_apellido,
        us_email,
        us_contrasena, // En producción, deberías hashear la contraseña con bcrypt
        us_contacto,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  }

  static async login({ us_email, us_contrasena }) {
    try {
      const query = `
        SELECT us_id, us_nombre, us_apellido, us_email, us_contacto, us_contrasena
        FROM usuarios
        WHERE us_email = $1 AND us_contrasena = $2
      `;
      // En producción, deberías usar bcrypt.compare() para comparar contraseñas hasheadas
      const result = await pool.query(query, [us_email, us_contrasena]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in login:", error);
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
        UPDATE usuarios
        SET ${fields.join(", ")}
        WHERE us_id = $${paramCount}
        RETURNING us_id, us_nombre, us_apellido, us_email, us_contacto
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
      const query = `
        DELETE FROM usuarios
        WHERE us_id = $1
        RETURNING us_id
      `;
      const result = await pool.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  }
}
