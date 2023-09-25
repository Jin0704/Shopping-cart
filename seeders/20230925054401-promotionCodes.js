'use strict';

const type = ['fix','percentage']
const code = ['123','666']

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('PromotionCodes',
      Array.from({length:2}).map((item, index) => ({
        id: index * 10 + 1,
        code: code[index],
        status: 1,
        usage: 'unlimited',
        type: type[index],
        discount: Math.floor(Math.random()*20)+1,
        validDate: '2023-11-02',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PromotionCodes', null, {})
  }
};
