const categoriaService = require('../services/categoria.service');

const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await categoriaService.obtenerCategorias(req.usuario.sucursal_id);
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener categorías', error: err.message });
  }
};

const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const sucursal_id = req.usuario.sucursal_id;

    const existente = await categoriaService.buscarPorNombre(nombre, sucursal_id);
    if (existente) {
      return res.status(400).json({ mensaje: 'Ya existe una categoría con ese nombre en esta sucursal.' });
    }

    const categoria = await categoriaService.crearCategoria({ nombre, sucursal_id });
    res.status(201).json(categoria);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear categoría', error: err.message });
  }
};

const actualizarCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const { id } = req.params;
    const sucursal_id = req.usuario.sucursal_id;

    const existente = await categoriaService.buscarPorNombre(nombre, sucursal_id, id);
    if (existente) {
      return res.status(400).json({ mensaje: 'Ya existe otra categoría con ese nombre en esta sucursal.' });
    }

    const actualizada = await categoriaService.actualizarCategoria(id, { nombre });
    res.json(actualizada);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar categoría', error: err.message });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    await categoriaService.eliminarCategoria(req.params.id);
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar categoría', error: err.message });
  }
};

module.exports = {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
};
