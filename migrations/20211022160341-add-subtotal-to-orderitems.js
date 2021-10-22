'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('OrderItems', 'subtotal', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('OrderItems', 'subtotal')
  }
};
