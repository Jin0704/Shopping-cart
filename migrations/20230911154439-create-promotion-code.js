'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PromotionCodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        unique: true
      },
      count: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      discount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },      
      usage: {
        type: Sequelize.ENUM,
        values:['date','usageLimited','unlimited']
      },
      type: {
        type: Sequelize.ENUM,
        values:['percentage','fix']
      },
      description: {
        type: Sequelize.TEXT
      },
      validDate: {
        type: Sequelize.DATE
      },
      usageLimited:{
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.dropTable('PromotionCodes');
  }
};