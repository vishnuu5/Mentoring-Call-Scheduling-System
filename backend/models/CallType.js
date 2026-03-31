import pool from '../config/database.js';

export const createCallTypeTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS call_types (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      icon VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

export const getAllCallTypes = async () => {
  const query = 'SELECT * FROM call_types ORDER BY name';
  const result = await pool.query(query);
  return result.rows;
};

export const getCallTypeById = async (id) => {
  const query = 'SELECT * FROM call_types WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const createCallType = async ({ name, description, icon }) => {
  const query = `
    INSERT INTO call_types (name, description, icon)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(query, [name, description, icon]);
  return result.rows[0];
};

// Seed initial call types
export const seedCallTypes = async () => {
  const callTypes = [
    {
      name: 'Resume Revamp',
      description: 'Get your resume reviewed and improved by experienced professionals',
      icon: '📄'
    },
    {
      name: 'Job Market Guidance',
      description: 'Learn about current job market trends and strategies',
      icon: '💼'
    },
    {
      name: 'Mock Interview - Tech',
      description: 'Practice technical interview questions with experts',
      icon: '💻'
    },
    {
      name: 'Mock Interview - Behavioral',
      description: 'Prepare for behavioral interview questions',
      icon: '🎯'
    },
    {
      name: 'Career Guidance',
      description: 'Get personalized career guidance and mentorship',
      icon: '🚀'
    }
  ];

  for (const callType of callTypes) {
    // Check if already exists
    const existing = await pool.query('SELECT id FROM call_types WHERE name = $1', [callType.name]);
    if (existing.rows.length === 0) {
      await createCallType(callType);
    }
  }
};
