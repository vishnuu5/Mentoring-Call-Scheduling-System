import pool from '../config/database.js';

export const createMentorTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS mentors (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      tags TEXT[],
      timezone VARCHAR(50) DEFAULT 'GMT',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

export const getAllMentors = async () => {
  const query = 'SELECT id, email, name, description, tags, timezone FROM mentors ORDER BY name';
  const result = await pool.query(query);
  return result.rows;
};

export const getMentorById = async (id) => {
  const query = 'SELECT id, email, name, description, tags, timezone FROM mentors WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const getMentorByEmail = async (email) => {
  const query = 'SELECT * FROM mentors WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

export const createMentor = async ({ email, password, name, description = '', tags = [] }) => {
  const query = `
    INSERT INTO mentors (email, password, name, description, tags)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, name, description, tags, timezone
  `;
  const result = await pool.query(query, [email, password, name, description, tags]);
  return result.rows[0];
};

export const updateMentor = async (id, { description, tags, timezone }) => {
  const query = `
    UPDATE mentors
    SET description = COALESCE($1, description),
        tags = COALESCE($2, tags),
        timezone = COALESCE($3, timezone),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING id, email, name, description, tags, timezone
  `;
  const result = await pool.query(query, [description, tags, timezone, id]);
  return result.rows[0];
};
