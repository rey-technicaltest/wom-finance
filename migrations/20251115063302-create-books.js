"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Books", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: Sequelize.STRING,
      author: Sequelize.STRING,
      price: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      holdStock: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0 },
      stock: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0 },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Books");
  },
};
