import { sequelize } from "../config/database";
import { Book } from "../models";
import Order, { TransactionStatus } from "../models/Transaction";
import TransactionDetail from "../models/TransactionDetail";

export const reportService = async () => {
  return await Book.findAll({
    attributes: [
      "id",
      "title",
      "stock",
      [
        sequelize.fn(
          "COALESCE",
          sequelize.fn("SUM", sequelize.col("transactionDetails.quantity")),
          0
        ),
        "soldQuantity",
      ],
      [
        sequelize.literal(
          "COALESCE(SUM(transactionDetails.price * transactionDetails.quantity), 0)"
        ),
        "revenue",
      ],
    ],
    include: [
      {
        model: TransactionDetail,
        attributes: [],
        as: "transactionDetails",
        include: [
          {
            model: Order,
            attributes: [],
            as: "transaction",
            where: { status: TransactionStatus.COMPLETED },
            required: false,
          },
        ],
        required: false,
      },
    ],
    group: ["Book.id", "Book.title", "Book.stock"],
    order: [[sequelize.literal("revenue"), "DESC"]],
  });
};
