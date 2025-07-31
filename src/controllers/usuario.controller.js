const { Usuario } = require('../../models');
const bcrypt = require('bcryptjs');

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      where: { activo: true },
      attributes: ['id', 'username', 'rol', 'sucursal_id']
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: err.message });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { username, password, rol, sucursal_id } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    usuario.username = username;
    usuario.rol = rol;
    usuario.sucursal_id = sucursal_id;
    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }

    await usuario.save();
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar', error: err.message });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    await usuario.update({ activo: false });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: err.message });
  }
};

const registrarUsuario = async (req, res) => {
  try {
    const { username, password, rol, sucursal_id } = req.body;

    if (!username || !password || !rol || !sucursal_id) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    const existente = await Usuario.findOne({ where: { username } });
    if (existente) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    const hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      username,
      password: hash,
      rol,
      sucursal_id,
      activo: true
    });

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        username: nuevoUsuario.username,
        rol: nuevoUsuario.rol,
        sucursal_id: nuevoUsuario.sucursal_id
      }
    });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: err.message });
  }
};

module.exports = {
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  registrarUsuario
};
