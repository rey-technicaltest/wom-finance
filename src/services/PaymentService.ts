import { adjustmentStock } from "../utils/QueryHelper";
import { Book } from "../models";
import { CustomException } from "../utils/customException";
import { EXCEPTION_MESSAGE } from "../utils/exceptionMessage";
import { sequelize } from "../config/database";
import { Transaction } from "sequelize";
import Order, { TransactionStatus } from "../models/Transaction";
import PaymentCallback, { paymentStatus } from "../models/PaymentCallback";
import TransactionDetail from "../models/TransactionDetail";

export const paymentCallbackService = (payload: {
  paymentReference: string;
  status: string;
}) => {
  return sequelize.transaction(async (transaction: Transaction) => {
    const trx = await Order.findOne({
      where: {
        paymentReference: payload.paymentReference,
        status: TransactionStatus.PENDING,
      },
      include: [
        {
          model: TransactionDetail,
          as: "details",
          include: [{ model: Book, as: "book" }],
        },
      ],
    });

    if (!trx)
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "transaction not founded or already process",
      });

    if (payload.status == paymentStatus.paid) {
      const stock =
        trx.details?.map((item) => {
          return {
            id: item.bookId,
            holdStock: (item.book?.holdStock ?? 0) - item.quantity,
            stock: (item.book?.stock ?? 0) - item.quantity,
          };
        }) ?? [];

      if (stock.length > 0) {
        await adjustmentStock(stock, transaction);
      }
    }

    await trx.update({
      paymentStatus: payload.status,
      status:
        payload.status == paymentStatus.paid
          ? TransactionStatus.COMPLETED
          : TransactionStatus.PENDING,
    });

    await PaymentCallback.create({
      transactionId: trx.id,
      status: payload.status,
      response: payload,
    });

    return trx;
  });
};
