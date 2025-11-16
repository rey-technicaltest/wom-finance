import { Request, Response } from "express";
import Joi from "joi";
import { EXCEPTION_MESSAGE, responseHandler } from "../utils/exceptionMessage";
import {
  addBookService,
  getBooksService,
  updateBookService,
} from "../services/BookService";

export const getBooksController = async (req: Request, res: Response) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    author: Joi.string().optional(),
  });

  const payload = { ...req.body, ...req.query };
  const { error } = schema.validate(payload, { allowUnknown: true });

  if (error) {
    return responseHandler(
      res,
      EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY,
      error.details[0].message,
      true
    );
  }

  const result = await getBooksService(payload);

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    result,
  });
};

export const addBookController = async (req: Request, res: Response) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
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

  const result = await addBookService(req.body);

  return responseHandler(res, EXCEPTION_MESSAGE.CREATED, {
    message: "Success",
    result,
  });
};

export const updateBookController = async (req: Request, res: Response) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().optional(),
    author: Joi.string().optional(),
    price: Joi.number().optional(),
    stock: Joi.number().optional(),
    isActive: Joi.boolean().optional(),
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

  const result = await updateBookService(req.body);

  return responseHandler(res, EXCEPTION_MESSAGE.CREATED, {
    message: "Success",
    result,
  });
};
