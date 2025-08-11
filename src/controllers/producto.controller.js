const productoService = require('../services/producto.service');

// Obtener todos los productos de la sucursal del usuario autenticado
const obtenerProductos = async (req, res) => {
  try {
    const sucursalId = req.usuario.sucursal_id;
    const productos = await productoService.obtenerProductos(sucursalId);
    res.json(productos);
  } catch (err) {
    console.error('Error obtenerProductos:', err);
    res.status(500).json({ mensaje: 'Error al obtener productos', error: err.message });
  }
};

// Obtener producto por ID (sin filtrar por sucursal, solo info)
const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await productoService.obtenerProductoPorId(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    console.error('Error obtenerProductoPorId:', err);
    res.status(500).json({ mensaje: 'Error al obtener producto', error: err.message });
  }
};

// Buscar producto por código de barras y sucursal (nuevo endpoint)
const buscarPorCodigoBarras = async (req, res) => {
  try {
    const { codigo } = req.params;
    const sucursalId = req.usuario.sucursal_id;
    if (!codigo) return res.status(400).json({ mensaje: 'Código de barras es requerido' });

    const producto = await productoService.buscarPorCodigoYPorSucursal(codigo, sucursalId);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado con ese código de barras' });

    res.json(producto);
  } catch (err) {
    console.error('Error buscarPorCodigoBarras:', err);
    res.status(500).json({ mensaje: 'Error al buscar producto por código de barras', error: err.message });
  }
};

// Crear producto (solo admin o rol permitido, validar antes en middleware)
const crearProducto = async (req, res) => {
  try {
    const data = req.body;
    const sucursalId = req.usuario.sucursal_id;

    if (req.file) {
      data.imagen = `/uploads/${req.file.filename}`;
    }

    // Validar código de barras único en la sucursal
    const existe = await productoService.buscarPorCodigoYPorSucursal(data.codigo_barras, sucursalId);
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe un producto con ese código de barras en esta sucursal.' });
    }

    const producto = await productoService.crearProducto(data, sucursalId);
    res.status(201).json(producto);
  } catch (err) {
    console.error('Error crearProducto:', err);
    res.status(500).json({ mensaje: 'Error al crear producto', error: err.message });
  }
};

// Actualizar producto (validar rol para stock y código único)
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

    // Verificar que el producto pertenece a la sucursal del usuario (si aplicable)
    if (productoOriginal.sucursal_id !== sucursalId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para actualizar este producto' });
    }

    // Validar código de barras único en la sucursal, ignorando el producto actual
    if (data.codigo_barras && data.codigo_barras !== productoOriginal.codigo_barras) {
      const otro = await productoService.buscarPorCodigoYPorSucursal(data.codigo_barras, sucursalId, productoId);
      if (otro) {
        return res.status(400).json({ mensaje: 'Ya existe otro producto con ese código de barras en esta sucursal.' });
      }
    }

    // Restringir reducción de stock para no administradores
    if (
      rol !== 'administrador' &&
      data.hasOwnProperty('stock') &&
      Number(data.stock) < productoOriginal.stock
    ) {
      return res.status(403).json({ mensaje: 'Solo un administrador puede reducir el stock.' });
    }

    const producto = await productoService.actualizarProducto(productoId, data);
    res.json(producto);
  } catch (err) {
    console.error('Error actualizarProducto:', err);
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: err.message });
  }
};

// Eliminar producto (solo admin idealmente)
const eliminarProducto = async (req, res) => {
  try {
    const productoId = req.params.id;
    const sucursalId = req.usuario.sucursal_id;

    const producto = await productoService.obtenerProductoPorId(productoId);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    if (producto.sucursal_id !== sucursalId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este producto' });
    }

    await productoService.eliminarProducto(productoId);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error eliminarProducto:', err);
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: err.message });
  }
};

// Obtener alertas de inventario: productos con stock bajo y productos caducados
const obtenerAlertasInventario = async (req, res) => {
  try {
    const sucursalId = req.usuario.sucursal_id;
    const productos = await productoService.obtenerProductos(sucursalId);

    const hoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const bajoStock = productos.filter(p => p.stock <= 5);
    const caducados = productos.filter(p => p.fechaCaducidad && p.fechaCaducidad <= hoy);

    res.json({
      bajoStock,
      caducados
    });
  } catch (err) {
    console.error('Error obtenerAlertasInventario:', err);
    res.status(500).json({ mensaje: 'Error al obtener alertas de inventario', error: err.message });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  buscarPorCodigoBarras,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerAlertasInventario
};