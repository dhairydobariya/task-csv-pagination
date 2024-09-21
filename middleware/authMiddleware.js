const jwt = require('jsonwebtoken');
const User = require('../model/usermodel'); // Adjust if needed

const secret = 'fdyetfyhgjhkl'; // Ensure this matches your JWT secret

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: 'No token provided' });

      const decoded = jwt.verify(token, secret);
      req.user = decoded.data;

      const user = await User.findById(req.user._id);
      if (!user) return res.status(401).json({ message: 'User not found' });

      if (roles.length && !roles.includes(user.roll)) {
        return res.status(403).json({ message: 'Access forbidden: insufficient role' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = authMiddleware;
