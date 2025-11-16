import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class ErrorLog extends Model {
  public id!: number;
  public message!: string;
  public level!: string;
  public statusCode!: number;
  public destination!: string;
  public raw!: string;
  public userId!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ErrorLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    message: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    level: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    destination: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    raw: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "ErrorLogs",
    modelName: "ErrorLog",
  }
);

export default ErrorLog;
