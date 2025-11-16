import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import CartDetail from "./CartDetail";

class Cart extends Model {
  public id!: number;
  public userId!: number;

  public items?: CartDetail[];
}
Cart.init(
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
  },
  { sequelize, modelName: "Cart" }
);

export default Cart;
