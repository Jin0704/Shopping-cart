'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsToMany(models.Cart, {
        as: 'carts',
        through: {
          model: models.CartItem, unique: false
        },
        foreignKey: "ProductId"
      });
      Product.belongsToMany(models.Order, {
        as: 'orders',
        through: {
          model: models.OrderItem, unique: false
        },
        foreignKey: 'ProductId'
      });
      Product.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'ProductId',
        as: 'FavoritedUsers'
      });
      Product.belongsTo(models.Category)
    }
  };
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};