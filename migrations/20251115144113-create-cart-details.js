"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CartDetails", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      cartId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: "Carts", key: "id" },
        onDelete: "CASCADE",
      },

      bookId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: { model: "Books", key: "id" },
        onDelete: "CASCADE",
      },

      quantity: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: 1 },

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

    await queryInterface.addConstraint("CartDetails", {
      fields: ["cartId", "bookId"],
      type: "unique",
      name: "unique_cart_book",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("CartDetails");
  },
};
