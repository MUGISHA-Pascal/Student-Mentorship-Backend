import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// export const checkAdmin = (req, res, next) => {
//   if (req.userRole !== 'ADMIN') {
//     return res.status(403).json({ error: 'Access denied. Admins only' });
//   }
//   next();
// };

export const verifyAdmin = (req, res, next) => {
  const { password } = req.body;
  if (password !== "10//.") {
    return res
      .status(403)
      .json({
        message: "Invalid password"
      });
  }
  next();
};
