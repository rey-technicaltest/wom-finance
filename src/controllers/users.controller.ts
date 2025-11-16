import _ from "lodash";
import { addUserService } from "../services/UserService";
import { EXCEPTION_MESSAGE, responseHandler } from "../utils/exceptionMessage";
import { Request, Response } from "express";
import { roleType } from "../models/User";
import Joi from "joi";

export const addUserController = async (req: Request, res: Response) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
      .valid(..._.values(roleType))
      .required(),
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

  const result = await addUserService(req.body);

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    result,
  });
};
