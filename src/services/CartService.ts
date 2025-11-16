import { CustomException } from "../utils/customException";
import { EXCEPTION_MESSAGE } from "../utils/exceptionMessage";
import { sequelize } from "../config/database";
import { Sequelize, Transaction } from "sequelize";
import Book from "../models/Book";
import Cart from "../models/Cart";
import CartDetail from "../models/CartDetail";

export const getCartItem = (userId: string) => {
  return sequelize.transaction(async () => {
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartDetail,
          as: "items",
          include: [{ model: Book, as: "book" }],
        },
      ],
    });

    if (!cart)
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "You don't have a cart yet",
      });

    return cart;
  });
};

export const addCartItems = (payload: {
  cartDetail: CartDetail;
  userId: string;
}) => {
  return sequelize.transaction(async (transaction: Transaction) => {
    const checkStock = await Book.findOne({
      where: { id: payload.cartDetail.bookId },
    });

    if (!checkStock || checkStock.stock < payload.cartDetail.quantity)
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "Insufficient stock for the requested book.",
      });

    let cart = await Cart.findOne({
      where: { userId: payload.userId },
      transaction,
    });

    if (!cart) {
      cart = await Cart.create({ userId: payload.userId }, { transaction });
    }

    const cartDetail = await sequelize.query(
      `INSERT INTO CartDetails (cartId, bookId, quantity)
      VALUES (:cartId, :bookId, :qty)
      ON DUPLICATE KEY UPDATE quantity = quantity + :qty`,
      {
        replacements: {
          cartId: cart.id,
          bookId: payload.cartDetail.bookId,
          qty: payload.cartDetail.quantity,
        },
        transaction,
      }
    );

    return cartDetail;
  });
};

export const updateCartItems = (payload: {
  cartDetail: CartDetail;
  userId: string;
  type: "addition" | "subtraction";
}) => {
  return sequelize.transaction(async (transaction: Transaction) => {
    const cart = await Cart.findOne({ where: { userId: payload.userId } });

    if (!cart)
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "You don't have a cart yet",
      });

    const cartDetail = await CartDetail.findOne({
      where: { cartid: cart.id, bookId: payload.cartDetail.bookId },
    });

    if (!cartDetail)
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "Cart detail not founded",
      });

    const checkStock = await Book.findOne({
      where: { id: payload.cartDetail.bookId },
    });

    if (
      !checkStock ||
      (payload.type == "addition" &&
        checkStock.stock < payload.cartDetail.quantity + cartDetail.quantity)
    )
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "Insufficient stock for the requested book.",
      });

    const qty =
      payload.type == "addition"
        ? `quantity + ${payload.cartDetail.quantity}`
        : `quantity - ${payload.cartDetail.quantity}`;

    if (
      payload.type === "subtraction" &&
      cartDetail.quantity - payload.cartDetail.quantity <= 0
    ) {
      await CartDetail.destroy({ where: { id: cartDetail.id }, transaction });
    } else {
      await CartDetail.update(
        {
          quantity: Sequelize.literal(qty),
        },
        {
          where: { id: cartDetail.id },
          transaction,
        }
      );
    }

    return cart;
  });
};

export const deleteCartItems = (payload: {
  bookId: string;
  userId: string;
}) => {
  return sequelize.transaction(async (transaction: Transaction) => {
    const cart = await Cart.findOne({ where: { userId: payload.userId } });

    if (!cart)
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "You don't have a cart yet",
      });

    await CartDetail.destroy({
      where: { cartId: cart.id, bookId: payload.bookId },
      transaction,
    });

    return cart;
  });
};
