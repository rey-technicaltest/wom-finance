import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import TransactionDetail from "./TransactionDetail";

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

class Order extends Model {
  public id!: number;
  public userId!: number;
  public totalPrice!: number;
  public paymentReference?: string;
  public paymentStatus!: string;
  public status!: number;

  public details: TransactionDetail[] | undefined;
}
Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    totalPrice: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },

    paymentReference: DataTypes.STRING,

    paymentStatus: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: true,
    },

    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { sequelize, modelName: "Order", tableName: "Transactions" }
);

export default Order;
