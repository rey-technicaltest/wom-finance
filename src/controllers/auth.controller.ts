import { Request, Response } from "express";
import Joi from "joi";
import { auth } from "../services/AuthService";
import { EXCEPTION_MESSAGE, responseHandler } from "../utils/exceptionMessage";

export const login = async (req: Request, res: Response) => {
  const { email, password, deviceId } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    deviceId: Joi.string().required(),
  });

  const { error } = schema.validate(req.body, { allowUnknown: true });

  if (error) {
    return responseHandler(
      res,
      EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY,
      error.details[0].message,
      true
    );
  }

  const data = await auth(email, password, deviceId);

  return responseHandler(res, EXCEPTION_MESSAGE.CREATED, {
    message: "Login successful",
    data,
  });
};
