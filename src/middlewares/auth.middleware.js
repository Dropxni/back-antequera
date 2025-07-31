const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const verificarAutenticacion = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

const soloAdministrador = (req, res, next) => {
  if (req.usuario?.rol !== 'administrador') {
    return res.status(403).json({ mensaje: 'Acceso restringido a administradores' });
  }
  next();
};

module.exports = { verificarAutenticacion, soloAdministrador };