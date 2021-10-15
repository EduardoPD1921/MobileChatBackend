const JwtService = require('../services/JwtService');

function authMiddleware(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['authorization'];

  if (!token) {
    res.status(403).send('access-denied');
  } else {
    try {
      const verify = JwtService.verifyToken(token);
      if (verify) {
        res.locals.token = token;
        next();
      }
    } catch (error) {
      res.status(401).send(error.message);
    }
  }
};

module.exports = authMiddleware;