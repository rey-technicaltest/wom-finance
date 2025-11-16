"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ErrorLogs", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      message: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      level: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      statusCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      destination: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      raw: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ErrorLogs");
  },
};
