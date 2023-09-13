'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Product)
      Category.belongsToMany(models.PromotionCode,{
        as: 'CategoryPromotionCodes',
        through:{ 
          model: models.PromotionCodeCategory,
          unique: false
        },
        foreignKey: 'categoryId'
      })
    }
  };
  Category.init({
    name: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};