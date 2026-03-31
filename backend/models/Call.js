import pool from '../config/database.js';

export const createCallTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS calls (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      mentor_id INTEGER NOT NULL,
      call_type_id INTEGER,
      call_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      timezone VARCHAR(50) DEFAULT 'GMT',
      status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
      google_meet_link VARCHAR(500),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE,
      FOREIGN KEY (call_type_id) REFERENCES call_types(id) ON DELETE SET NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_calls_user_id ON calls(user_id);
    CREATE INDEX IF NOT EXISTS idx_calls_mentor_id ON calls(mentor_id);
    CREATE INDEX IF NOT EXISTS idx_calls_call_date ON calls(call_date);
  `;
  await pool.query(query);
};

export const createCall = async ({ userId, mentorId, callTypeId, callDate, startTime, endTime, timezone, googleMeetLink = null, notes = '' }) => {
  const query = `
    INSERT INTO calls (user_id, mentor_id, call_type_id, call_date, start_time, end_time, timezone, google_meet_link, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const result = await pool.query(query, [userId, mentorId, callTypeId, callDate, startTime, endTime, timezone, googleMeetLink, notes]);
  return result.rows[0];
};

export const getCallById = async (id) => {
  const query = `
    SELECT c.*, ct.name as call_type_name, u.name as user_name, u.email as user_email, 
           m.name as mentor_name, m.email as mentor_email
    FROM calls c
    LEFT JOIN call_types ct ON c.call_type_id = ct.id
    JOIN users u ON c.user_id = u.id
    JOIN mentors m ON c.mentor_id = m.id
    WHERE c.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const getAllCalls = async () => {
  const query = `
    SELECT c.*, ct.name as call_type_name, u.name as user_name, u.email as user_email,
           m.name as mentor_name, m.email as mentor_email
    FROM calls c
    LEFT JOIN call_types ct ON c.call_type_id = ct.id
    JOIN users u ON c.user_id = u.id
    JOIN mentors m ON c.mentor_id = m.id
    ORDER BY c.call_date, c.start_time
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const getCallsByUser = async (userId) => {
  const query = `
    SELECT c.*, ct.name as call_type_name, m.name as mentor_name, m.email as mentor_email
    FROM calls c
    LEFT JOIN call_types ct ON c.call_type_id = ct.id
    JOIN mentors m ON c.mentor_id = m.id
    WHERE c.user_id = $1
    ORDER BY c.call_date, c.start_time
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const getCallsByMentor = async (mentorId) => {
  const query = `
    SELECT c.*, ct.name as call_type_name, u.name as user_name, u.email as user_email
    FROM calls c
    LEFT JOIN call_types ct ON c.call_type_id = ct.id
    JOIN users u ON c.user_id = u.id
    WHERE c.mentor_id = $1
    ORDER BY c.call_date, c.start_time
  `;
  const result = await pool.query(query, [mentorId]);
  return result.rows;
};

export const updateCall = async (id, { status, googleMeetLink, notes }) => {
  const query = `
    UPDATE calls
    SET status = COALESCE($1, status),
        google_meet_link = COALESCE($2, google_meet_link),
        notes = COALESCE($3, notes),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
  `;
  const result = await pool.query(query, [status, googleMeetLink, notes, id]);
  return result.rows[0];
};

export const deleteCall = async (id) => {
  const query = 'DELETE FROM calls WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
