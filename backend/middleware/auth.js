import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }
  next();
};

export const userOnly = (req, res, next) => {
  if (req.user?.role !== 'user') {
    return res.status(403).json({ error: 'User access only' });
  }
  next();
};

export const mentorOnly = (req, res, next) => {
  if (req.user?.role !== 'mentor') {
    return res.status(403).json({ error: 'Mentor access only' });
  }
  next();
};
