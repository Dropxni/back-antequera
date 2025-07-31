const { Usuario } = require('../../models');
const bcrypt = require('bcryptjs');

const obtenerUsuarios = async () => {
  return await Usuario.findAll({
    where: { activo: true },
    attributes: ['id', 'username', 'rol', 'sucursal_id']
  });
};

const registrarUsuario = async ({ username, password, rol, sucursal_id }) => {
  const existente = await Usuario.findOne({ where: { username } });
  if (existente) throw new Error('El usuario ya existe');

  const hash = await bcrypt.hash(password, 10);

  return await Usuario.create({
    username,
    password: hash,
    rol,
    sucursal_id,
    activo: true
  });
};

const actualizarUsuario = async (id, { username, password, rol, sucursal_id }) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new Error('Usuario no encontrado');

  usuario.username = username;
  usuario.rol = rol;
  usuario.sucursal_id = sucursal_id;

  if (password) {
    usuario.password = await bcrypt.hash(password, 10);
  }

  return await usuario.save();
};

const eliminarUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new Error('Usuario no encontrado');

  return await usuario.update({ activo: false });
};

module.exports = {
  obtenerUsuarios,
  registrarUsuario,
  actualizarUsuario,
  eliminarUsuario
};