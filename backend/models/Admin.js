import pool from '../config/database.js';

export const createAdminTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

export const getAdminByEmail = async (email) => {
  const query = 'SELECT * FROM admins WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

export const getAdminById = async (id) => {
  const query = 'SELECT id, email, name FROM admins WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const createAdmin = async ({ email, password, name }) => {
  const query = `
    INSERT INTO admins (email, password, name)
    VALUES ($1, $2, $3)
    RETURNING id, email, name
  `;
  const result = await pool.query(query, [email, password, name]);
  return result.rows[0];
};
