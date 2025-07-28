'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PagoCredito extends Model {
    static associate(models) {
      PagoCredito.belongsTo(models.Credito, { foreignKey: 'credito_id' });
      PagoCredito.belongsTo(models.Usuario, { foreignKey: 'cajero_id' });
    }
  }
  PagoCredito.init({
    credito_id: { type: DataTypes.INTEGER, allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    cajero_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha_pago: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    observaciones: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'PagoCredito',
    tableName: 'pagos_credito',
    timestamps: false
  });
  return PagoCredito;
};
