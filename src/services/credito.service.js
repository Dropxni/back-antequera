const { Credito, Venta, Cliente, PagoCredito, Usuario } = require("../../models");
const { Op } = require("sequelize");

const registrarCredito = async (data, usuarioId, sucursalId) => {
  // Nota: ajusta los campos según tu modelo y datos que recibas
  const { venta_id, cliente_id, monto_total, fecha_limite_pago, cliente_nombre, cliente_telefono } = data;

  // Puedes implementar lógica para crear cliente si cliente_id no viene, o validar venta, etc.

  return await Credito.create({
    venta_id,
    cliente_id,
    total: monto_total,
    saldo_pendiente: monto_total,
    estado: "pendiente",
    usuario_id: usuarioId,
    sucursal_id: sucursalId,
    fecha_limite_pago,
    cliente_nombre,
    cliente_telefono,
  });
};

const obtenerCreditosPorSucursal = async (sucursalId) => {
  return await Credito.findAll({
    where: {
      sucursal_id: sucursalId,
      estado: "pendiente",
    },
    include: [
      { model: Cliente, attributes: ["nombre", "telefono"] },
      { model: Venta, attributes: ["id", "fecha", "total"] },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const obtenerCreditoConPagos = async (creditoId) => {
  return await Credito.findByPk(creditoId, {
    include: [
      { model: Cliente, attributes: ["nombre", "telefono"] },
      { model: Venta, attributes: ["fecha", "total"] },
      {
        model: PagoCredito,
        include: [{ model: Usuario, attributes: ["nombre"] }],
        order: [["fecha", "DESC"]],
      },
    ],
  });
};

const cancelarCredito = async (creditoId) => {
  const credito = await Credito.findByPk(creditoId);
  if (!credito || credito.estado === "pagado") return null;

  credito.estado = "cancelado";
  credito.saldo_pendiente = 0;
  await credito.save();
  return credito;
};

module.exports = {
  registrarCredito,
  obtenerCreditosPorSucursal,
  obtenerCreditoConPagos,
  cancelarCredito,
};