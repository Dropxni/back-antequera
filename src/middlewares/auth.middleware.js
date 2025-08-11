const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('La variable de entorno JWT_SECRET no está definida');
}

// Middleware: Verifica autenticación JWT
const verificarAutenticacion = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado o malformado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validar campos mínimos en el token decodificado
    if (!decoded.id || !decoded.rol || !decoded.sucursal_id) {
      return res.status(401).json({ mensaje: 'Token inválido: datos incompletos' });
    }

    req.usuario = decoded; // { id, username, rol, sucursal_id }
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

// Middleware genérico para verificar roles
const verificarRol = (rolesPermitidos = []) => (req, res, next) => {
  if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: 'Acceso denegado: rol no autorizado' });
  }
  next();
};

const soloAdministrador = verificarRol(['administrador']);
const soloCajero = verificarRol(['cajero']);
const administradorOCajero = verificarRol(['administrador', 'cajero']);

module.exports = {
  verificarAutenticacion,
  soloAdministrador,
  soloCajero,
  administradorOCajero
};