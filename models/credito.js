'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Credito extends Model {
    static associate(models) {
      Credito.belongsTo(models.Cliente, { foreignKey: 'cliente_id' });
      Credito.belongsTo(models.Venta, { foreignKey: 'venta_id' });
      Credito.belongsTo(models.Sucursal, { foreignKey: 'sucursal_id' });
      Credito.belongsTo(models.Usuario, { foreignKey: 'cajero_id' });
      Credito.hasMany(models.PagoCredito, { foreignKey: 'credito_id' });
    }
  }
  Credito.init({
    cliente_id: DataTypes.INTEGER,
    nombre_cliente: { type: DataTypes.STRING, allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    monto_pagado: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    descripcion: DataTypes.TEXT,
    estado: { type: DataTypes.ENUM('activo', 'pagado', 'cancelado'), defaultValue: 'activo' },
    venta_id: DataTypes.INTEGER,
    sucursal_id: { type: DataTypes.INTEGER, allowNull: false },
    cajero_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha_credito: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    fecha_limite: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Credito',
    tableName: 'creditos',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at'
  });
  return Credito;
};
