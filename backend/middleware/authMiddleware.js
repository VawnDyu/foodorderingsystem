const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check for the access token in cookies
  const token = req.cookies.accessToken;  // Change this to match your cookie name for accessToken

  console.log('Access Token from Cookies:', token);
  console.log('All Cookies:', req.cookies);

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the same secret as the one you used when generating it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    console.log('Decoded User:', decoded);

    // Attach the decoded user to the request object
    req.user = decoded;  
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Invalid or Expired Token:', err);

    // If the token is expired, we might want to handle refresh logic here
    // (You can decide if you want to refresh the token on this level or in the frontend)
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
