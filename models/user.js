'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order);
      User.belongsToMany(models.Product, {
        through: models.Favorite,
        foreignKey: 'UserId',
        as: 'FavoritedProducts'
      })
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    address: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};