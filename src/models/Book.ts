import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public price!: number;
  public holdStock!: number;
  public stock!: number;
  isActive!: boolean;
}
Book.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, unique: true, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.NUMBER, allowNull: false },
    holdStock: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    stock: { type: DataTypes.NUMBER, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, modelName: "Book" }
);

export default Book;
