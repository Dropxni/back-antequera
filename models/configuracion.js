'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Configuracion extends Model {
    static associate(models) {
      Configuracion.belongsTo(models.Sucursal, { foreignKey: 'sucursal_id' });
    }
  }

  Configuracion.init({
    clave: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    valor: { type: DataTypes.TEXT, allowNull: true },
    descripcion: { type: DataTypes.STRING(200), allowNull: true },
    sucursal_id: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'Configuracion',
    tableName: 'configuraciones',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at',
    indexes: [{ unique: true, fields: ['clave'] }]
  });

  return Configuracion;
};