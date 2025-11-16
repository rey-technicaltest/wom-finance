import {
  addCartItems,
  deleteCartItems,
  getCartItem,
  updateCartItems,
} from "./../services/CartService";
import { EXCEPTION_MESSAGE, responseHandler } from "../utils/exceptionMessage";
import { Request, Response } from "express";
import Joi from "joi";

export const getCartItemController = async (req: Request, res: Response) => {
  const result = await getCartItem(req.body.userId);

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    result,
  });
};

export const addCartItemsController = async (req: Request, res: Response) => {
  const schema = Joi.object({
    bookId: Joi.number().required(),
    quantity: Joi.number().required(),
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

  const result = await addCartItems({
    cartDetail: req.body,
    userId: req.body.userId,
  });

  return responseHandler(res, EXCEPTION_MESSAGE.CREATED, {
    message: "Success",
    result,
  });
};

export const updateCartItemsController = async (
  req: Request,
  res: Response
) => {
  const schema = Joi.object({
    bookId: Joi.number().required(),
    quantity: Joi.number().required(),
    type: Joi.string().required(),
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

  const result = await updateCartItems({
    cartDetail: req.body,
    userId: req.body.userId,
    type: req.body.type,
  });

  return responseHandler(res, EXCEPTION_MESSAGE.CREATED, {
    message: "Success",
    result,
  });
};

export const deleteCartItemsController = async (
  req: Request,
  res: Response
) => {
  const schema = Joi.object({
    bookId: Joi.number().required(),
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

  const result = await deleteCartItems({
    bookId: req.body.bookId,
    userId: req.body.userId,
  });

  return responseHandler(res, EXCEPTION_MESSAGE.CREATED, {
    message: "Success",
    result,
  });
};
