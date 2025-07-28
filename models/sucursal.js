'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sucursal extends Model {
    static associate(models) {
      Sucursal.hasMany(models.Usuario, { foreignKey: 'sucursal_id' });
      Sucursal.hasMany(models.Producto, { foreignKey: 'sucursal_id' });
    }
  }
  Sucursal.init({
    codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    direccion: DataTypes.TEXT,
    telefono: DataTypes.STRING,
    activa: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Sucursal',
    tableName: 'sucursales',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Sucursal;
};