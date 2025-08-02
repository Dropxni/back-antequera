const { CorteCaja, Venta } = require('../../models');
const { Op } = require('sequelize');

exports.abrirCorteService = async (usuario, cambio_inicial) => {
  const corteAbierto = await CorteCaja.findOne({
    where: {
      cajero_id: usuario.id,
      sucursal_id: usuario.sucursal_id,
      abierto: true
    }
  });

  if (corteAbierto) {
    throw new Error('Ya hay un corte abierto para este cajero');
  }

  return await CorteCaja.create({
    cajero_id: usuario.id,
    sucursal_id: usuario.sucursal_id,
    cambio_inicial
  });
};

exports.obtenerCorteActualService = async (usuario) => {
  const corte = await CorteCaja.findOne({
    where: {
      cajero_id: usuario.id,
      sucursal_id: usuario.sucursal_id,
      abierto: true
    },
    include: ['Ventas']
  });

  if (!corte) throw new Error('No hay un corte abierto');

  return corte;
};

exports.cerrarCorteService = async (usuario) => {
  const corte = await CorteCaja.findOne({
    where: {
      cajero_id: usuario.id,
      sucursal_id: usuario.sucursal_id,
      abierto: true
    }
  });

  if (!corte) throw new Error('No hay corte abierto');

  const ventas = await Venta.findAll({
    where: {
      cajero_id: usuario.id,
      sucursal_id: usuario.sucursal_id,
      createdAt: {
        [Op.gte]: corte.createdAt
      }
    }
  });

  let efectivo = 0, tarjeta = 0, transferencia = 0, credito = 0;

  for (const v of ventas) {
    if (v.metodo_pago === 'efectivo') efectivo += v.total;
    else if (v.metodo_pago === 'tarjeta') tarjeta += v.total;
    else if (v.metodo_pago === 'transferencia') transferencia += v.total;
    else if (v.metodo_pago === 'credito') credito += v.total;

    // Asociar corte a venta
    v.corte_id = corte.id;
    await v.save();
  }

  corte.total_efectivo = efectivo;
  corte.total_tarjeta = tarjeta;
  corte.total_transferencia = transferencia;
  corte.total_credito = credito;
  corte.abierto = false;

  await corte.save();

  return corte;
};