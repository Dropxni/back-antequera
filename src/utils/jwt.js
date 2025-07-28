const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const generarToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || '24h'
  });
};

const verificarToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generarToken, verificarToken };
