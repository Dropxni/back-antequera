'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CorteCaja extends Model {
    static associate(models) {
      CorteCaja.belongsTo(models.Usuario, { foreignKey: 'cajero_id' });
      CorteCaja.belongsTo(models.Sucursal, { foreignKey: 'sucursal_id' });
    }
  }

  CorteCaja.init({
    cajero_id: { type: DataTypes.INTEGER, allowNull: false },
    sucursal_id: { type: DataTypes.INTEGER, allowNull: false },
    dinero_inicial: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    dinero_final: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    total_ventas: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    total_efectivo: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    total_tarjeta: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    total_transferencia: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    diferencia: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    fecha_inicio: { type: DataTypes.DATE, allowNull: false },
    fecha_corte: { type: DataTypes.DATE, allowNull: true },
    observaciones: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'CorteCaja',
    tableName: 'cortes_caja',
    timestamps: false,
    indexes: [
      { fields: ['fecha_corte'] },
      { fields: ['cajero_id'] },
      { fields: ['sucursal_id'] }
    ]
  });

  return CorteCaja;
};