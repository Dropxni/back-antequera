const productoService = require('../services/producto.service');

const obtenerProductos = async (req, res) => {
  try {
    const sucursalId = req.usuario.sucursal_id;
    const productos = await productoService.obtenerProductos(sucursalId);
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
    const sucursalId = req.usuario.sucursal_id;

    if (req.file) {
      data.imagen = `/uploads/${req.file.filename}`;
    }

    // Validar código de barras único en la sucursal
    const existe = await productoService.buscarPorCodigoYPorSucursal(data.codigoBarras, sucursalId);
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe un producto con ese código de barras en esta sucursal.' });
    }

    const producto = await productoService.crearProducto(data, sucursalId);
    res.status(201).json(producto);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear producto', error: err.message });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const data = req.body;
    const productoId = req.params.id;
    const sucursalId = req.usuario.sucursal_id;
    const rol = req.usuario.rol;

    if (req.file) {
      data.imagen = `/uploads/${req.file.filename}`;
    }

    const productoOriginal = await productoService.obtenerProductoPorId(productoId);
    if (!productoOriginal) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Verificar si el código de barras ya existe en otro producto de la misma sucursal
    const otro = await productoService.buscarPorCodigoYPorSucursal(data.codigoBarras, sucursalId, productoId);
    if (otro) {
      return res.status(400).json({ mensaje: 'Ya existe otro producto con ese código de barras en esta sucursal.' });
    }

    // ⚠️ Restringir reducción de stock si no es admin
    if (rol !== 'admin' && Number(data.stock) < productoOriginal.stock) {
      return res.status(403).json({ mensaje: 'Solo un administrador puede reducir el stock.' });
    }

    const producto = await productoService.actualizarProducto(productoId, data);
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

// Obtener productos bajos en stock y caducados
const obtenerAlertasInventario = async (req, res) => {
  try {
    const sucursalId = req.usuario.sucursal_id;
    const productos = await productoService.obtenerProductos(sucursalId);

    const hoy = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const bajoStock = productos.filter(p => p.stock <= 5);
    const caducados = productos.filter(p => p.fechaCaducidad && p.fechaCaducidad <= hoy);

    res.json({
      bajoStock,
      caducados
    });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener alertas de inventario', error: err.message });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerAlertasInventario
};
