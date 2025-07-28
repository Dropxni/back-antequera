'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      Producto.belongsTo(models.Categoria, { foreignKey: 'categoria_id' });
      Producto.belongsTo(models.Sucursal, { foreignKey: 'sucursal_id' });
      Producto.hasMany(models.VentaProducto, { foreignKey: 'producto_id' });
      Producto.hasMany(models.MovimientoInventario, { foreignKey: 'producto_id' });
    }
  }
  Producto.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    categoria_id: DataTypes.INTEGER,
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    imagen: DataTypes.STRING,
    codigo_barras: DataTypes.STRING,
    fecha_caducidad: DataTypes.DATE,
    sucursal_id: { type: DataTypes.INTEGER, allowNull: false },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Producto',
    tableName: 'productos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Producto;
};