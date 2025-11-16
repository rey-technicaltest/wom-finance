import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Book from "./Book";

class TransactionDetail extends Model {
  public id!: number;
  public transactionId!: number;
  public bookId!: number;
  public quantity!: number;
  public price!: number;

  public book: Book | undefined;
}

TransactionDetail.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    transactionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    bookId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },

    price: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  { sequelize, modelName: "TransactionDetail" }
);

export default TransactionDetail;
