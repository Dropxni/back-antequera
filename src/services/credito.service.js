const { Credito, PagoCredito, Cliente, Venta, Usuario } = require('../../models');
const { Op } = require('sequelize');

exports.listarCreditosActivos = async (sucursal_id) => {
  return await Credito.findAll({
    where: { sucursal_id, estado: 'activo' },
    include: [{ model: Cliente, attributes: ['id', 'nombre'] }],
    order: [['fecha_credito', 'DESC']]
  });
};

exports.listarCreditosFinalizados = async (sucursal_id) => {
  return await Credito.findAll({
    where: { sucursal_id, estado: { [Op.in]: ['pagado', 'cancelado'] } },
    include: [{ model: Cliente, attributes: ['id', 'nombre'] }],
    order: [['fecha_credito', 'DESC']]
  });
};

exports.obtenerCreditoConPagos = async (credito_id) => {
  const credito = await Credito.findByPk(credito_id, {
    include: [
      { model: Cliente, attributes: ['id', 'nombre'] },
      {
        model: PagoCredito,
        include: [{ model: Usuario, attributes: ['id', 'username'] }],
        order: [['fecha_pago', 'ASC']]
      }
    ]
  });
  if (!credito) throw new Error('Crédito no encontrado');
  return credito;
};

exports.crearCredito = async ({
  cliente_id,
  nombre_cliente,
  monto,
  descripcion,
  fecha_limite,
  venta_id,
  cajero_id,
  sucursal_id
}) => {
  // Verificar que al menos uno esté presente
  if (!cliente_id && !nombre_cliente) {
    throw new Error('Debe proporcionar un cliente existente o un nombre de cliente');
  }

  let nombreFinal = nombre_cliente;

  // Si se proporciona cliente_id, buscar nombre
  if (cliente_id) {
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    nombreFinal = cliente.nombre;
  }

  const credito = await Credito.create({
    cliente_id: cliente_id || null,
    nombre_cliente: nombreFinal,
    monto,
    monto_pagado: 0,
    descripcion: descripcion || null,
    fecha_limite: fecha_limite || null,
    venta_id: venta_id || null,
    sucursal_id,
    cajero_id,
    estado: 'activo'
  });

  return credito;
};

exports.registrarPago = async (credito_id, { monto, observaciones, cajero_id }) => {
  const credito = await Credito.findByPk(credito_id);
  if (!credito || credito.estado !== 'activo') {
    throw new Error('Crédito no válido o ya finalizado');
  }
  const nuevoPagado = parseFloat(credito.monto_pagado) + parseFloat(monto);
  const nuevoEstado = nuevoPagado >= parseFloat(credito.monto) ? 'pagado' : 'activo';

  const pago = await PagoCredito.create({
    credito_id,
    monto,
    observaciones: observaciones || null,
    cajero_id
  });

  await credito.update({ monto_pagado: nuevoPagado, estado: nuevoEstado });
  return pago;
};

exports.cancelarCredito = async (credito_id) => {
  const credito = await Credito.findByPk(credito_id);
  if (!credito) throw new Error('Crédito no encontrado');
  if (credito.estado === 'pagado' || credito.estado === 'cancelado') {
    throw new Error('No se puede cancelar un crédito ya finalizado');
  }
  await credito.update({ monto_pagado: credito.monto, estado: 'cancelado' });
  return credito;
};