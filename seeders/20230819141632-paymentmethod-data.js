'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('PaymentMethods',
      ['ATM轉帳', '信用卡', '現金'].map((item, index) => ({
        id: index * 10 + 1,
        name: item,
        status: 1,
        description: item,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PaymentMethods', null, {})
  }
};
