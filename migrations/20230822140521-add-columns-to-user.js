'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'name', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('Users', 'gender', {
      type: Sequelize.BOOLEAN
    })
    await queryInterface.addColumn('Users', 'address', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING
    })        
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'name')
    await queryInterface.removeColumn('Users', 'gender')
    await queryInterface.removeColumn('Users', 'address')
    await queryInterface.removeColumn('Users', 'image')
  }
};
