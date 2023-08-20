'use strict';

const faker = require('faker')
const paymentStatus = ['已付款','未付款','款項待確認']
const shippingStatus = ['出貨完成','已出貨','出貨準備中']

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Orders',
      Array.from({ length: 2 }).map((item, index) => ({
        name: faker.commerce.productName(),
        phone: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        amount: faker.datatype.number(),
        sn: faker.datatype.number(),
        shipping_status: shippingStatus[index],
        payment_status: paymentStatus[index],
        UserId:1,
        PaymentMethodId:21,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', null, {})
  }
};
