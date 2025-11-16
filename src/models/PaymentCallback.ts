import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export enum paymentStatus {
  paid = "paid",
  pending = "pending",
  failed = "failed",
}

class PaymentCallback extends Model {
  public id!: number;
  public transactionId!: number;
  public status!: string;
  public response!: any;
}
PaymentCallback.init(
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

    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    response: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { sequelize, modelName: "PaymentCallback" }
);

export default PaymentCallback;
