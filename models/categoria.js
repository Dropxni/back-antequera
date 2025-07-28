'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
      Categoria.belongsTo(models.Sucursal, { foreignKey: 'sucursal_id' });
      Categoria.hasMany(models.Producto, { foreignKey: 'categoria_id' });
    }
  }
  Categoria.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    sucursal_id: DataTypes.INTEGER,
    activa: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'Categoria',
    tableName: 'categorias',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [{ unique: true, fields: ['nombre', 'sucursal_id'] }]
  });
  return Categoria;
};
