const { Producto } = require('../../models');

const obtenerProductos = async (sucursal_id) => {
  return await Producto.findAll({
    where: { sucursal_id, activo: true },
    order: [['nombre', 'ASC']]
  });
};

const obtenerProductoPorId = async (id) => {
  return await Producto.findByPk(id);
};

const crearProducto = async (data, sucursal_id) => {
  data.sucursal_id = sucursal_id;
  return await Producto.create(data);
};

const actualizarProducto = async (id, data) => {
  const producto = await Producto.findByPk(id);
  if (!producto) throw new Error('Producto no encontrado');
  return await producto.update(data);
};

const eliminarProducto = async (id) => {
  const producto = await Producto.findByPk(id);
  if (!producto) throw new Error('Producto no encontrado');
  return await producto.update({ activo: false });
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};