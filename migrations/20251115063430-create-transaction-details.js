"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TransactionDetails", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      transactionId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: "Transactions", key: "id" },
        onDelete: "CASCADE",
      },

      bookId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: "Books", key: "id" },
        onDelete: "SET NULL",
      },

      quantity: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("TransactionItems");
  },
};
