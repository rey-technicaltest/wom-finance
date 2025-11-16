import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Book from "./Book";

class CartDetail extends Model {
  public id!: number;
  public cartId!: number;
  public bookId!: number;
  public quantity!: number;

  public book?: Book;
}
CartDetail.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    cartId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    bookId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
  },
  { sequelize, modelName: "CartDetail" }
);

export default CartDetail;
