'use strict';
const bcrypt = require('bcryptjs')
const SEED_USER = {
  email: 'root@example.com',
  password: '12345678',
  isAdmin: true
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: SEED_USER.email,
      password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(6), null),
      isAdmin: SEED_USER.isAdmin,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
