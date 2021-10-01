'use strict';

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 10 }).map((item, index) =>
      ({
        id: index + 1,
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.product() + '/' + faker.commerce.productName(),
        image: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})
  }
};
