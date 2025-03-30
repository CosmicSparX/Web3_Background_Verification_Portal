const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id and check if token is still valid
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found, access denied' });
    }
    
    // Set user in request
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid, access denied' });
  }
};

module.exports = auth; 