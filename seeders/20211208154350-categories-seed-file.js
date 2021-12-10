'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories',
      ['食物', '衣物', '休閒娛樂', '住家裝飾', '書籍', '其它'].map((item, index) => ({
        id: index * 10 + 1,
        name: item,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
