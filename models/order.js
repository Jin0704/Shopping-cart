'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsToMany(models.Product, {
        as: 'items',
        through: {
          model: models.OrderItem, unique: false
        },
        foreignKey: 'OrderId'
      });
      Order.belongsTo(models.User)
      Order.hasMany(models.Payment)
      Order.belongsTo(models.PaymentMethod,{
        as:'methods',
        foreignKey:'PaymentMethodId'
      })
    }
  };
  Order.init({
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    sn: DataTypes.BIGINT,
    payment_status: DataTypes.STRING,
    shipping_status: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    PaymentMethodId: DataTypes.INTEGER,
    promotionCodeId: DataTypes.INTEGER,
    discount: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};