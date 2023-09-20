'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'promotionCodeId', {
      type: Sequelize.INTEGER,
        references: {
        model: 'PromotionCodes',
        key: 'id'
      }
    })
    await queryInterface.addColumn('Orders', 'discount', {
      type: Sequelize.INTEGER
    })    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'promotionCodeId')
    await queryInterface.removeColumn('Orders', 'discount')
  }
};
