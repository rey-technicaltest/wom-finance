import { Op, Transaction } from "sequelize";
import { sequelize } from "../config/database";
import Book from "../models/Book";
import { CustomException } from "../utils/customException";
import { EXCEPTION_MESSAGE } from "../utils/exceptionMessage";
import { roleType } from "../models/User";

export const getBooksService = (payload: {
  title: string;
  author: string;
  role: roleType;
}) => {
  const whereClause: {
    title?: any;
    author?: string;
    stock?: any;
    isActive?: boolean;
  } = {};

  if (payload.role !== roleType.admin) {
    whereClause.isActive = true;
    whereClause.stock = { [Op.gt]: 0 };
  }

  if (payload.title) {
    whereClause.title = { [Op.like]: `%${payload.title}%` };
  }
  if (payload.author) {
    whereClause.author = payload.author;
  }

  return Book.findAll({ where: whereClause });
};

export const addBookService = (payload: Book) => {
  return sequelize.transaction(async (transaction: Transaction) => {
    const data = { ...payload };
    const book = await Book.create(data, { transaction });

    if (!book) {
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "Failed to create book",
      });
    }

    return book;
  });
};

export const updateBookService = (payload: Book) => {
  return sequelize.transaction(async (transaction: Transaction) => {
    const data = { ...payload };
    const book = await Book.update(data, {
      where: { id: payload.id },
      transaction,
    });

    if (!book) {
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "Failed to create book",
      });
    }

    return book;
  });
};
