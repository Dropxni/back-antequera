const { Credito, PagoCredito, Usuario } = require("../../models");

const registrarPago = async (creditoId, data, usuarioId) => {
  const { monto, fecha, observaciones } = data;

  // Verificar que el crédito existe y está pendiente
  const credito = await Credito.findByPk(creditoId);
  if (!credito) {
    throw new Error("Crédito no encontrado");
  }

  if (credito.estado !== "pendiente") {
    throw new Error("El crédito ya está pagado o cancelado");
  }

  if (monto > credito.saldo_pendiente) {
    throw new Error("El monto del pago excede el saldo pendiente");
  }

  // Calcular nuevo saldo
  const nuevoSaldo = credito.saldo_pendiente - monto;
  credito.saldo_pendiente = nuevoSaldo <= 0 ? 0 : nuevoSaldo;
  
  // Si el saldo llega a 0, marcar como pagado
  if (nuevoSaldo <= 0) {
    credito.estado = "pagado";
    credito.fecha_pago = new Date();
  }

  await credito.save();

  // Crear el pago
  const nuevoPago = await PagoCredito.create({
    credito_id: creditoId,
    monto,
    fecha,
    observaciones, // Incluir observaciones
    usuario_id: usuarioId
  });

  // Devolver el pago con información del usuario
  return await PagoCredito.findByPk(nuevoPago.id, {
    include: [
      { model: Usuario, attributes: ["nombre"] }
    ]
  });
};

const obtenerPagosPorCredito = async (creditoId) => {
  return await PagoCredito.findAll({
    where: { credito_id: creditoId },
    include: [
      { model: Usuario, attributes: ["nombre"] }
    ],
    order: [["fecha", "DESC"]]
  });
};

module.exports = {
  registrarPago,
  obtenerPagosPorCredito
};