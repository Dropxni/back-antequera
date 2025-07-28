'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venta extends Model {
    static associate(models) {
      Venta.belongsTo(models.Usuario, { foreignKey: 'cajero_id' });
      Venta.belongsTo(models.Sucursal, { foreignKey: 'sucursal_id' });
      Venta.hasMany(models.VentaProducto, { foreignKey: 'venta_id' });
      Venta.hasOne(models.Credito, { foreignKey: 'venta_id' });
    }
  }
  Venta.init({
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    metodo_pago: { type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'credito'), allowNull: false },
    monto_recibido: DataTypes.DECIMAL(10, 2),
    cambio: DataTypes.DECIMAL(10, 2),
    cajero_id: { type: DataTypes.INTEGER, allowNull: false },
    sucursal_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha_venta: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    activa: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Venta',
    tableName: 'ventas',
    timestamps: false
  });
  return Venta;
};