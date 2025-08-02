const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Middleware para verificar que el token JWT sea válido
const verificarAutenticacion = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // El token debe contener { id, username, rol, sucursal_id }
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

// Middleware para restringir acceso solo a administradores
const soloAdministrador = (req, res, next) => {
  if (req.usuario?.rol !== 'administrador') {
    return res.status(403).json({ mensaje: 'Acceso restringido a administradores' });
  }
  next();
};

// Middleware para restringir acceso solo a cajeros
const soloCajero = (req, res, next) => {
  if (req.usuario?.rol !== 'cajero') {
    return res.status(403).json({ mensaje: 'Acceso restringido a cajeros' });
  }
  next();
};

// Middleware para permitir acceso a ambos roles
const administradorOCajero = (req, res, next) => {
  const rol = req.usuario?.rol;
  if (rol !== 'administrador' && rol !== 'cajero') {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }
  next();
};

module.exports = {
  verificarAutenticacion,
  soloAdministrador,
  soloCajero,
  administradorOCajero
};