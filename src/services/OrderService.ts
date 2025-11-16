import { Op, Transaction } from "sequelize";
import { sequelize } from "../config/database";
import { Book, Cart, CartDetail } from "../models";
import { CustomException } from "../utils/customException";
import { EXCEPTION_MESSAGE } from "../utils/exceptionMessage";
import Order, { TransactionStatus } from "../models/Transaction";
import TransactionDetail from "../models/TransactionDetail";
import { convertObject } from "../utils/tools";
import { adjustmentHoldStock } from "../utils/QueryHelper";
import { paymentStatus } from "../models/PaymentCallback";

export const getTransactionService = async (payload: {
  transactionId: string;
  userId: string;
  paymentStatus: paymentStatus;
  status: TransactionStatus;
  paymentReference: string;
}) => {
  let whereClause: {
    id?: string;
    userId?: string;
    paymentStatus?: paymentStatus;
    status?: TransactionStatus;
    paymentReference?: any;
  } = {};

  if (payload.transactionId) whereClause.id = payload.transactionId;
  if (payload.userId) whereClause.userId = payload.userId;
  if (payload.status) whereClause.status = payload.status;
  if (payload.paymentStatus) whereClause.paymentStatus = payload.paymentStatus;
  if (payload.paymentReference)
    whereClause.paymentReference = whereClause.paymentReference = {
      [Op.like]: `%${payload.paymentReference}%`,
    };

  return await Order.findAll({
    where: whereClause,
    include: [
      {
        model: TransactionDetail,
        as: "details",
        include: [{ model: Book, as: "book" }],
      },
    ],
  });
};

export const checkoutService = (cartId: string, userId: string) => {
  return sequelize.transaction(async (transaction: Transaction) => {
    const cart = convertObject(
      await Cart.findOne({
        where: { id: cartId },
        include: [
          {
            model: CartDetail,
            as: "items",
            include: [{ model: Book, as: "book" }],
          },
        ],
        transaction,
        lock: transaction.LOCK.UPDATE,
      })
    );

    if (!cart)
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "cart not founded",
      });

    const totalPrice =
      cart.items?.reduce(
        (total: number, item: { quantity: number; book: { price: any } }) => {
          return total + item.quantity * (item.book?.price ?? 0);
        },
        0
      ) ?? 0;

    const dataTransaction = {
      userId,
      totalPrice,
      status: TransactionStatus.PENDING,
    };

    const order = await Order.create(dataTransaction, { transaction });

    const dataTransactionDetails = await cart.items.map(
      (item: { bookId: string; quantity: number; book: { price: number } }) => {
        return {
          transactionId: order.id,
          bookId: item.bookId,
          quantity: item.quantity,
          price: item.book?.price ?? 0,
        };
      }
    );

    const paymentGatewayResponse = {
      redirectUrl: `https://payment.com/pay/${order.id}`,
      paymentReference: `PAY-${order.id}`,
    };

    const updateStock = await cart.items.map(
      (item: {
        bookId: string;
        quantity: number;
        book: { holdStock: number };
      }) => {
        return {
          id: item.bookId,
          holdStock: item.book.holdStock + item.quantity,
        };
      }
    );

    await adjustmentHoldStock(updateStock, transaction);

    await Order.update(
      { paymentReference: paymentGatewayResponse.paymentReference },
      { where: { id: order.id }, transaction }
    );

    await TransactionDetail.bulkCreate(dataTransactionDetails, {
      transaction,
    });

    await Cart.destroy({ where: { id: cartId }, transaction });

    return {
      transactionId: order.id,
      paymentUrl: paymentGatewayResponse.redirectUrl,
    };
  });
};
