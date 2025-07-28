'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MovimientoInventario extends Model {
    static associate(models) {
      MovimientoInventario.belongsTo(models.Producto, { foreignKey: 'producto_id' });
      MovimientoInventario.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
      MovimientoInventario.belongsTo(models.Venta, { foreignKey: 'venta_id' });
    }
  }

  MovimientoInventario.init({
    producto_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo_movimiento: { 
      type: DataTypes.ENUM('entrada', 'salida', 'ajuste', 'caducidad'),
      allowNull: false
    },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    stock_anterior: { type: DataTypes.INTEGER, allowNull: false },
    stock_nuevo: { type: DataTypes.INTEGER, allowNull: false },
    motivo: { type: DataTypes.STRING(200), allowNull: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    venta_id: { type: DataTypes.INTEGER, allowNull: true },
    fecha_movimiento: { type: DataTypes.DATE, allowNull: true }
  }, {
    sequelize,
    modelName: 'MovimientoInventario',
    tableName: 'movimientos_inventario',
    timestamps: false,
    indexes: [
      { fields: ['producto_id'] },
      { fields: ['fecha_movimiento'] },
      { fields: ['tipo_movimiento'] }
    ]
  });

  return MovimientoInventario;
};
