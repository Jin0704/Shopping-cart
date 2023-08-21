'use strict';

const faker = require('faker')
const imageURL = [
  'https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/sushi-8113165_1280.jpg',
  'https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/macbook-459196_1280.jpg',
  'https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/bird-8155768_1280.jpg',
  'https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/asparagus-2169305_1280.jpg',
  'https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/ice-cream-1274894_1280.jpg',
  'https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/lemon-butterflyfish-380037_1280.jpg',
  'https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/macarons-2548827_1280.jpg',
  'https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/beef-20678_1280.jpg',
  'https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/tea-783352_1280.jpg',
  'https://shopping-cart-tj.s3.ap-southeast-1.amazonaws.com/cherry-cake-8152717_1280.jpg'
]
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 10 }).map((item, index) =>
      ({
        id: index + 1,
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price()),
        description: faker.commerce.product() + '/' + faker.commerce.productName(),
        image: imageURL[index],
        createdAt: new Date(),
        updatedAt: new Date(),
        CategoryId: Math.floor(Math.random() * 6) * 10 + 1
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})
  }
};
