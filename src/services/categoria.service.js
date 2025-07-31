const { Categoria } = require('../../models');
const { Op } = require('sequelize');

const obtenerCategorias = async (sucursal_id) => {
  return await Categoria.findAll({
    where: { sucursal_id, activa: true },
    order: [['nombre', 'ASC']]
  });
};

const buscarPorNombre = async (nombre, sucursal_id, excluirId = null) => {
  const where = {
    nombre,
    sucursal_id,
    activa: true
  };

  if (excluirId) {
    where.id = { [Op.ne]: excluirId };
  }

  return await Categoria.findOne({ where });
};

const crearCategoria = async (data) => {
  return await Categoria.create(data);
};

const actualizarCategoria = async (id, data) => {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) throw new Error('Categoría no encontrada');
  return await categoria.update(data);
};

const eliminarCategoria = async (id) => {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) throw new Error('Categoría no encontrada');
  return await categoria.update({ activa: false });
};

module.exports = {
  obtenerCategorias,
  buscarPorNombre,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
};
