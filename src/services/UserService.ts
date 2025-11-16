import { Transaction } from "sequelize";
import { sequelize } from "../config/database";
import User from "../models/User";
import { generatePassword } from "../utils/tools";

export const addUserService = (payload: User) => {
  return sequelize.transaction(async (transaction: Transaction) => {
    const passwordObj = generatePassword(payload.email, payload.password);

    const body = {
      email: payload.email,
      role: payload.role,
      password: passwordObj.password,
      salt: passwordObj.salt,
    };

    const user = await User.create(body, { transaction });

    return user;
  });
};
