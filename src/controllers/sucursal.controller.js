const sucursalService = require('../services/sucursal.service');

const crear = async (req, res) => {
  try {
    const nueva = await sucursalService.crearSucursal(req.body);
    res.status(201).json({ mensaje: 'Sucursal creada', sucursal: nueva });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear sucursal', error: err.message });
  }
};

const listar = async (req, res) => {
  try {
    const sucursales = await sucursalService.obtenerSucursales();
    res.json(sucursales);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener sucursales', error: err.message });
  }
};

const actualizar = async (req, res) => {
  try {
    const actualizada = await sucursalService.actualizarSucursal(req.params.id, req.body);
    if (!actualizada) return res.status(404).json({ mensaje: 'Sucursal no encontrada' });
    res.json({ mensaje: 'Sucursal actualizada', sucursal: actualizada });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar sucursal', error: err.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const eliminada = await sucursalService.eliminarSucursal(req.params.id);
    if (!eliminada) return res.status(404).json({ mensaje: 'Sucursal no encontrada' });
    res.json({ mensaje: 'Sucursal desactivada' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar sucursal', error: err.message });
  }
};

module.exports = {
  crear,
  listar,
  actualizar,
  eliminar
};