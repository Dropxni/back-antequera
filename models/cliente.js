'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    static associate(models) {
      Cliente.belongsTo(models.Sucursal, { foreignKey: 'sucursal_id' });
      Cliente.hasMany(models.Credito, { foreignKey: 'cliente_id' });
    }
  }
  Cliente.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    telefono: DataTypes.STRING,
    direccion: DataTypes.TEXT,
    sucursal_id: { type: DataTypes.INTEGER, allowNull: false },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Cliente;
};
