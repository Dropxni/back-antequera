'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VentaProducto extends Model {
    static associate(models) {
      VentaProducto.belongsTo(models.Venta, { foreignKey: 'venta_id' });
      VentaProducto.belongsTo(models.Producto, { foreignKey: 'producto_id' });
    }
  }
  VentaProducto.init({
    venta_id: { type: DataTypes.INTEGER, allowNull: false },
    producto_id: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
  }, {
    sequelize,
    modelName: 'VentaProducto',
    tableName: 'venta_productos',
    timestamps: false
  });
  return VentaProducto;
};
