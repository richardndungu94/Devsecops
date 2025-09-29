
const jwt = require('jsonwebtoken');

// Auth middleware (original)
module.exports = function (req, res, next) {
   const token = req.header('Authorization')?.split(' ')[1]; // the bearer token
   if (!token) return res.status(401).json({ msg: 'No token, access denied' });

   try {
   // WARNING: Hardcoded secret! Secrets should be stored securely in environment variables, not in code.
   // Use: jwt.verify(token, process.env.JWT_SECRET)
   const decoded = jwt.verify(token, 'insecure_secret');
      req.user = decoded;
      next();
   } catch (err) {
      res.status(401).json({ msg: 'Invalid token' });
   }
};

// isAdmin middleware
module.exports.isAdmin = function (req, res, next) {
   // Example: check if user has admin role
   if (req.user && req.user.role === 'admin') {
      return next();
   }
   return res.status(403).json({ msg: 'Access denied: Admins only' });
};