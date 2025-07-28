'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsTo(models.Sucursal, { foreignKey: 'sucursal_id' });
      Usuario.hasMany(models.Venta, { foreignKey: 'cajero_id' });
      Usuario.hasMany(models.MovimientoInventario, { foreignKey: 'usuario_id' });
      Usuario.hasMany(models.Credito, { foreignKey: 'cajero_id' });
      Usuario.hasMany(models.PagoCredito, { foreignKey: 'cajero_id' });
      Usuario.hasMany(models.CorteCaja, { foreignKey: 'cajero_id' });
    }
  }
  Usuario.init({
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: { type: DataTypes.ENUM('administrador', 'cajero', 'supervisor'), allowNull: false },
    sucursal_id: DataTypes.INTEGER,
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Usuario;
};
