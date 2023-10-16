"use strict";
const bcrypt = require("bcryptjs");
const faker = require("faker");
const SEED_USER = [
  {
    email: "root@example.com",
    address: faker.address.streetAddress(),
    name: "root",
    password: "12345678",
    gender: 1,
    isAdmin: true,
  },
  {
    email: "321@321.com",
    address: faker.address.streetAddress(),
    name: faker.name.firstName(),
    password: "12345678",
    gender: 1,
    isAdmin: false,
  },
  {
    email: "123@123.com",
    address: faker.address.streetAddress(),
    name: faker.name.firstName(),
    password: "12345678",
    gender: 0,
    isAdmin: false,
  },
  {
    email: "test@test.com",
    address: faker.address.streetAddress(),
    name: faker.name.firstName(),
    password: "12345678",
    gender: 0,
    isAdmin: false,
  },
  {
    email: "test1@test.com",
    address: faker.address.streetAddress(),
    name: faker.name.firstName(),
    password: "12345678",
    gender: 1,
    isAdmin: false,
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      SEED_USER.map((item, index) => ({
        id: index + 1,
        email: item.email,
        password: bcrypt.hashSync(item.password, bcrypt.genSaltSync(6), null),
        isAdmin: item.isAdmin,
        name: item.name,
        address: item.address,
        gender: item.gender,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
