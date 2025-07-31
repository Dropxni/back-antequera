const productoService = require('../services/producto.service');

const obtenerProductos = async (req, res) => {
  try {
    const productos = await productoService.obtenerProductos(req.usuario.sucursal_id);
    res.json(productos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: err.message });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await productoService.obtenerProductoPorId(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error', error: err.message });
  }
};

const crearProducto = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.imagen = `/uploads/${req.file.filename}`;
    }
    const producto = await productoService.crearProducto(data, req.usuario.sucursal_id);
    res.status(201).json(producto);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear producto', error: err.message });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.imagen = `/uploads/${req.file.filename}`;
    }
    const producto = await productoService.actualizarProducto(req.params.id, data);
    res.json(producto);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: err.message });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    await productoService.eliminarProducto(req.params.id);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: err.message });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};