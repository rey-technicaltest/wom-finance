import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export enum roleType {
  customer = "customer",
  admin = "admin",
}

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public salt!: string;
  public role!: "customer" | "admin";
  public currentToken?: string | null;
  public deviceId?: string | null;
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    salt: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("customer", "admin"),
      defaultValue: "customer",
    },
    currentToken: { type: DataTypes.STRING, allowNull: true },
    deviceId: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "User" }
);

export default User;
