const {
  abrirCorteService,
  cerrarCorteService,
  obtenerCorteActualService
} = require('../services/corteCaja.service');

exports.abrirCorte = async (req, res) => {
  try {
    const corte = await abrirCorteService(req.usuario, req.body.cambio_inicial);
    res.status(201).json({ ok: true, corte });
  } catch (error) {
    console.error('Error al abrir corte:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

exports.cerrarCorte = async (req, res) => {
  try {
    const corte = await cerrarCorteService(req.usuario);
    res.json({ ok: true, corte });
  } catch (error) {
    console.error('Error al cerrar corte:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

exports.obtenerCorteActual = async (req, res) => {
  try {
    const corte = await obtenerCorteActualService(req.usuario);
    res.json({ ok: true, corte });
  } catch (error) {
    console.error('Error al obtener corte actual:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};