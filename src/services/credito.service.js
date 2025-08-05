const { Credito, Venta, Cliente, PagoCredito, Usuario } = require("../../models");
const { Op } = require("sequelize");

// Registrar un nuevo crédito
const registrarCredito = async (data, cajeroId, sucursalId) => {
  const {
    venta_id,
    cliente_id,
    monto,
    descripcion,
    fecha_limite,
    nombre_cliente
  } = data;

  // Validaciones básicas opcionales (puedes mover a los validators si ya los tienes)
  if (!venta_id || !cliente_id || !monto || !nombre_cliente) {
    throw new Error("Faltan datos obligatorios para registrar el crédito.");
  }

  const credito = await Credito.create({
    venta_id,
    cliente_id,
    nombre_cliente,
    monto,
    monto_pagado: 0,
    descripcion: descripcion || null,
    estado: "activo",
    sucursal_id: sucursalId,
    cajero_id: cajeroId,
    fecha_credito: new Date(),
    fecha_limite: fecha_limite || null,
  });

  return credito;
};

// Obtener créditos activos por sucursal
const obtenerCreditosPorSucursal = async (sucursalId) => {
  return await Credito.findAll({
    where: {
      sucursal_id: sucursalId,
      estado: "activo",
    },
    include: [
      {
        model: Cliente,
        attributes: ["id", "nombre", "telefono"],
      },
      {
        model: Venta,
        attributes: ["id", "fecha", "total"],
      },
    ],
    order: [["fecha_credito", "DESC"]],
  });
};

// Obtener detalles de un crédito con su historial de pagos
const obtenerCreditoConPagos = async (creditoId) => {
  const credito = await Credito.findByPk(creditoId, {
    include: [
      {
        model: Cliente,
        attributes: ["id", "nombre", "telefono"],
      },
      {
        model: Venta,
        attributes: ["id", "fecha", "total"],
      },
      {
        model: PagoCredito,
        include: [
          {
            model: Usuario,
            attributes: ["id", "nombre"],
          },
        ],
        order: [["fecha_pago", "DESC"]],
      },
    ],
  });

  if (!credito) throw new Error("Crédito no encontrado");
  return credito;
};

// Cancelar un crédito (cambiar estado y poner saldo a 0)
const cancelarCredito = async (creditoId) => {
  const credito = await Credito.findByPk(creditoId);
  if (!credito) throw new Error("Crédito no encontrado");
  if (credito.estado === "pagado") throw new Error("El crédito ya fue pagado");

  credito.estado = "cancelado";
  credito.monto_pagado = credito.monto;
  await credito.save();

  return credito;
};

module.exports = {
  registrarCredito,
  obtenerCreditosPorSucursal,
  obtenerCreditoConPagos,
  cancelarCredito,
};