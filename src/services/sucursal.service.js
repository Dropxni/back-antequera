const { Sucursal } = require('../../models');

const crearSucursal = async (datos) => {
  return await Sucursal.create(datos);
};

const obtenerSucursales = async () => {
  return await Sucursal.findAll({ where: { activa: true } });
};

const obtenerSucursalPorId = async (id) => {
  return await Sucursal.findByPk(id);
};

const actualizarSucursal = async (id, datos) => {
  const sucursal = await obtenerSucursalPorId(id);
  if (!sucursal) return null;
  return await sucursal.update(datos);
};

const eliminarSucursal = async (id) => {
  const sucursal = await obtenerSucursalPorId(id);
  if (!sucursal) return null;
  return await sucursal.update({ activa: false });
};

module.exports = {
  crearSucursal,
  obtenerSucursales,
  obtenerSucursalPorId,
  actualizarSucursal,
  eliminarSucursal
};