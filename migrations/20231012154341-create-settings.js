'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      isPromotionCode: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      isRewardPoint: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      conversionAmountForRewardPoint: {
        type: Sequelize.INTEGER,
        defaultValue: 100
      },
      conversionValuePerRewardPoint: {
        type: Sequelize.FLOAT,
        defaultValue: 0.01
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Settings');
  }
};