'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PromotionCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // 一個折扣碼有多個訂單
      PromotionCode.hasMany(models.Order, { foreignKey:'promotionCodeId'})
      PromotionCode.belongsToMany(models.Category,{
        as:'PromotionCodeCategories',
        through: {
          model:models.PromotionCodeCategory,
          unique: false
        },
        foreignKey:'promotionCodeId',
      })
      
    }
  };
  PromotionCode.init({
    code: DataTypes.STRING,
    count: {
      type:DataTypes.INTEGER,
      defaultValue: 0
    },
    status: DataTypes.BOOLEAN,
    discount: DataTypes.INTEGER,
    usage: {
      type:DataTypes.ENUM,
      values:['date','usageLimited','unlimited']
    },
    type:{ 
      type:DataTypes.ENUM,
      values:['percentage','fix']
    },
    description: DataTypes.TEXT,
    usageLimited: DataTypes.INTEGER,
    validDate:{ 
      type:DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    sequelize,
    modelName: 'PromotionCode',
  });
  return PromotionCode;
};