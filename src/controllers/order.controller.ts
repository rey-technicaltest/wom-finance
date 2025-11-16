import _ from "lodash";
import {
  checkoutService,
  getTransactionService,
} from "../services/OrderService";
import { EXCEPTION_MESSAGE, responseHandler } from "../utils/exceptionMessage";
import { paymentCallbackService } from "../services/PaymentService";
import { paymentStatus } from "../models/PaymentCallback";
import { Request, Response } from "express";
import Joi from "joi";
import { TransactionStatus } from "../models/Transaction";

export const getTransactionController = async (req: Request, res: Response) => {
  const schema = Joi.object({
    transactionId: Joi.number().optional(),
    userId: Joi.number().optional(),
    paymentStatus: Joi.string()
      .valid(..._.values(paymentStatus))
      .optional(),
    status: Joi.string()
      .valid(..._.values(TransactionStatus))
      .optional(),
    paymentReference: Joi.string().optional(),
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

  const result = await getTransactionService(payload);

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    result,
  });
};

export const checkoutController = async (req: Request, res: Response) => {
  const schema = Joi.object({
    cartId: Joi.string().required(),
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

  const result = await checkoutService(req.body.cartId, req.body.userId);

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    result,
  });
};

export const paymentCallbackController = async (
  req: Request,
  res: Response
) => {
  const schema = Joi.object({
    paymentReference: Joi.string().required(),
    status: Joi.string()
      .valid(..._.values(paymentStatus))
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

  const result = await paymentCallbackService({
    paymentReference: req.body.paymentReference,
    status: req.body.status,
  });

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    result,
  });
};
