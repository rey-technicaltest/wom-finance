import { CustomException } from "../utils/customException";
import { EXCEPTION_MESSAGE } from "./../utils/exceptionMessage";
import { generateToken, verifyToken } from "../utils/jwt";
import { hashPassword } from "../utils/tools";
import { sequelize } from "../config/database";
import { Transaction } from "sequelize";
import User from "../models/User";

export const auth = async (
  email: string,
  password: string,
  deviceId: string
) => {
  return await sequelize.transaction(async (transaction: Transaction) => {
    const user = await User.findOne({
      where: { email },
      transaction,
    });

    if (!user) {
      throw new CustomException(EXCEPTION_MESSAGE.BAD_REQUEST, {
        message: "email not found",
      });
    }

    const hashedPassword = hashPassword(password, user.salt);

    if (hashedPassword !== user.password) {
      throw new CustomException(
        EXCEPTION_MESSAGE.INVALID_USERNAME_OR_PASSWORD,
        { message: `Invalid password ${email}` }
      );
    }

    const payloadToken = {
      userId: user.id,
      email: user.email,
      role: user.role,
      deviceId,
    };

    const token = await generateToken(payloadToken);

    await User.update(
      { currentToken: token, deviceId },
      { where: { id: user.id }, returning: true, transaction }
    );

    return { token };
  });
};
