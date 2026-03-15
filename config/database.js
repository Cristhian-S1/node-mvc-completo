import pkg from "pg";
const { Pool } = pkg;

// Configuración de PostgreSQL
export const pool = new Pool({
  user: process.env.DB_USER || "cristhian",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "dae",
  password: process.env.DB_PASSWORD || "femayor9",
  port: process.env.DB_PORT || 5432,
});

// Verificar conexión
pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Helper para ejecutar queries
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};
