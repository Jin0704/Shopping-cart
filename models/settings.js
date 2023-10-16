'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Settings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Settings.init({
    isPromotionCode:{
      type:DataTypes.BOOLEAN,
      defaultValue: true
    },
    isRewardPoint:{
      type:DataTypes.BOOLEAN,
      defaultValue: true
    },
    conversionAmountForRewardPoint:{
      type:DataTypes.INTEGER,
      defaultValue: 100
    },
    conversionValuePerRewardPoint:{
      type:DataTypes.FLOAT,
      defaultValue: 0.01
    },
  }, {
    sequelize,
    modelName: 'Settings',
  });
  return Settings;
};