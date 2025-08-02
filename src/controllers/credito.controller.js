const { validationResult } = require("express-validator");
const CreditoService = require("../services/credito.service");

const registrarCredito = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

  try {
    const nuevoCredito = await CreditoService.registrarCredito(
      req.body,
      req.usuario.id,
      req.usuario.sucursal_id
    );
    res.status(201).json(nuevoCredito);
  } catch (error) {
    console.error("Error al registrar el crédito:", error);
    res.status(500).json({ mensaje: "Error al registrar el crédito", error });
  }
};

const obtenerCreditosActivos = async (req, res) => {
  try {
    const creditos = await CreditoService.obtenerCreditosPorSucursal(req.usuario.sucursal_id);
    res.json(creditos);
  } catch (error) {
    console.error("Error al obtener créditos:", error);
    res.status(500).json({ mensaje: "Error al obtener créditos", error });
  }
};

const obtenerCreditoPorId = async (req, res) => {
  try {
    const credito = await CreditoService.obtenerCreditoConPagos(req.params.id);
    if (!credito) return res.status(404).json({ mensaje: "Crédito no encontrado" });
    res.json(credito);
  } catch (error) {
    console.error("Error al obtener el crédito:", error);
    res.status(500).json({ mensaje: "Error al obtener el crédito", error });
  }
};

const cancelarCredito = async (req, res) => {
  try {
    const cancelado = await CreditoService.cancelarCredito(req.params.id);
    if (!cancelado) return res.status(404).json({ mensaje: "Crédito no encontrado o ya pagado" });
    res.json({ mensaje: "Crédito cancelado correctamente" });
  } catch (error) {
    console.error("Error al cancelar el crédito:", error);
    res.status(500).json({ mensaje: "Error al cancelar el crédito", error });
  }
};

module.exports = {
  registrarCredito,
  obtenerCreditosActivos,
  obtenerCreditoPorId,
  cancelarCredito,
};