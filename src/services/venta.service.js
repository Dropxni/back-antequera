const { Venta, VentaProducto, Producto, MovimientoInventario, Credito } = require('../../models');
const { sequelize } = require('../../models');

async function realizarVentaService(data, usuario) {
  const {
    productos, total, metodo_pago, monto_recibido, cambio,
    cliente_id, nombre_cliente, descripcion, fecha_limite
  } = data;

  const cajero_id = usuario.id;
  const sucursal_id = usuario.sucursal_id;

  const t = await sequelize.transaction();

  try {
    const venta = await Venta.create({
      total,
      metodo_pago,
      monto_recibido,
      cambio,
      cajero_id,
      sucursal_id
    }, { transaction: t });

    for (const item of productos) {
      const producto = await Producto.findByPk(item.id, { transaction: t });

      if (!producto || producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${producto?.nombre || 'producto no encontrado'}`);
      }

      await VentaProducto.create({
        venta_id: venta.id,
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal
      }, { transaction: t });

      await MovimientoInventario.create({
        producto_id: item.id,
        tipo_movimiento: 'salida',
        cantidad: item.cantidad,
        stock_anterior: producto.stock,
        stock_nuevo: producto.stock - item.cantidad,
        motivo: 'Venta',
        usuario_id: cajero_id,
        venta_id: venta.id,
        fecha_movimiento: new Date()
      }, { transaction: t });

      await producto.update({
        stock: producto.stock - item.cantidad
      }, { transaction: t });
    }

    if (metodo_pago === 'credito') {
      await Credito.create({
        cliente_id: cliente_id || null,
        nombre_cliente,
        monto: total,
        monto_pagado: 0,
        descripcion,
        estado: 'activo',
        venta_id: venta.id,
        sucursal_id,
        cajero_id,
        fecha_credito: new Date(),
        fecha_limite: fecha_limite || null
      }, { transaction: t });
    }

    await t.commit();

    return { ok: true, venta_id: venta.id };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

module.exports = {
  realizarVentaService
};