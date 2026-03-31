import pool from '../config/database.js';

export const createAvailabilityTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS availability (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      mentor_id INTEGER,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      timezone VARCHAR(50) DEFAULT 'GMT',
      type VARCHAR(20) CHECK (type IN ('user', 'mentor')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_availability_user_id ON availability(user_id);
    CREATE INDEX IF NOT EXISTS idx_availability_mentor_id ON availability(mentor_id);
    CREATE INDEX IF NOT EXISTS idx_availability_date ON availability(date);
  `;
  await pool.query(query);
};

export const addAvailability = async ({ userId, mentorId, date, startTime, endTime, timezone, type }) => {
  const query = `
    INSERT INTO availability (user_id, mentor_id, date, start_time, end_time, timezone, type)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const result = await pool.query(query, [userId || null, mentorId || null, date, startTime, endTime, timezone, type]);
  return result.rows[0];
};

export const getAvailabilityByUser = async (userId, startDate, endDate) => {
  const query = `
    SELECT * FROM availability
    WHERE user_id = $1 AND date >= $2 AND date <= $3
    ORDER BY date, start_time
  `;
  const result = await pool.query(query, [userId, startDate, endDate]);
  return result.rows;
};

export const getAvailabilityByMentor = async (mentorId, startDate, endDate) => {
  const query = `
    SELECT * FROM availability
    WHERE mentor_id = $1 AND date >= $2 AND date <= $3
    ORDER BY date, start_time
  `;
  const result = await pool.query(query, [mentorId, startDate, endDate]);
  return result.rows;
};

export const deleteAvailability = async (id) => {
  const query = 'DELETE FROM availability WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const updateAvailability = async (id, { startTime, endTime }) => {
  const query = `
    UPDATE availability
    SET start_time = COALESCE($1, start_time),
        end_time = COALESCE($2, end_time),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
  `;
  const result = await pool.query(query, [startTime, endTime, id]);
  return result.rows[0];
};
