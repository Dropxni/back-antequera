const { realizarVentaService } = require('../services/venta.service');
const { Venta, VentaProducto, Producto, Usuario, Sucursal, Credito } = require('../../models');
const { Op } = require('sequelize');

// Crear una nueva venta
exports.realizarVenta = async (req, res) => {
  try {
    const resultado = await realizarVentaService(req.body, req.usuario);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al realizar venta:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

// Obtener ventas del día por sucursal
exports.obtenerVentasDelDia = async (req, res) => {
  try {
    const sucursal_id = req.usuario.sucursal_id;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const ventas = await Venta.findAll({
      where: {
        sucursal_id,
        createdAt: {
          [Op.gte]: hoy
        }
      },
      include: [
        { model: Usuario, attributes: ['id', 'nombre'] },
        {
          model: VentaProducto,
          include: [{ model: Producto }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ ok: true, ventas });
  } catch (error) {
    console.error('Error al obtener ventas del día:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

// Obtener detalle de una venta
exports.obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id, {
      include: [
        { model: Usuario, attributes: ['id', 'nombre'] },
        { model: Sucursal, attributes: ['id', 'nombre'] },
        {
          model: VentaProducto,
          include: [{ model: Producto }]
        },
        { model: Credito }
      ]
    });

    if (!venta) {
      return res.status(404).json({ ok: false, error: 'Venta no encontrada' });
    }

    res.json({ ok: true, venta });
  } catch (error) {
    console.error('Error al obtener venta por ID:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

// Obtener ventas por ID de corte (cuando tengas cortes implementados)
exports.obtenerVentasPorCorte = async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      where: {
        corte_id: req.params.corte_id
      },
      include: [
        { model: Usuario, attributes: ['id', 'nombre'] },
        {
          model: VentaProducto,
          include: [{ model: Producto }]
        }
      ]
    });

    res.json({ ok: true, ventas });
  } catch (error) {
    console.error('Error al obtener ventas por corte:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

// (Opcional) Eliminar venta
exports.eliminarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);

    if (!venta) {
      return res.status(404).json({ ok: false, error: 'Venta no encontrada' });
    }

    await venta.destroy();

    res.json({ ok: true, mensaje: 'Venta eliminada' });
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

exports.obtenerVentasPorRangoFechas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, metodo_pago, cajero_id } = req.query;
    const sucursal_id = req.usuario.sucursal_id;

    const filtros = {
      sucursal_id,
      createdAt: {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
      }
    };

    if (metodo_pago) filtros.metodo_pago = metodo_pago;
    if (cajero_id) filtros.cajero_id = cajero_id;

    const ventas = await Venta.findAll({
      where: filtros,
      include: [
        { model: Usuario, attributes: ['id', 'nombre'] },
        {
          model: VentaProducto,
          include: [{ model: Producto }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ ok: true, ventas });
  } catch (error) {
    console.error('Error al obtener ventas por rango:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

// Resumen de ventas (por día o rango)
exports.resumenVentas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const sucursal_id = req.usuario.sucursal_id;

    const ventas = await Venta.findAll({
      where: {
        sucursal_id,
        createdAt: {
          [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
        }
      }
    });

    let total_ventas = ventas.length;
    let total_ingresos = 0;
    let por_metodo = {};

    for (const v of ventas) {
      total_ingresos += v.total;
      por_metodo[v.metodo_pago] = (por_metodo[v.metodo_pago] || 0) + v.total;
    }

    res.json({
      ok: true,
      total_ventas,
      total_ingresos,
      ingresos_por_metodo: por_metodo
    });
  } catch (error) {
    console.error('Error en resumen de ventas:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};