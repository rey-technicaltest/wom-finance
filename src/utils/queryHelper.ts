import { Book } from "../models";

export const adjustmentHoldStock = async (
  items: { id: number; holdStock: number }[],
  transaction: any
) => {
  return await Book.bulkCreate(items, {
    updateOnDuplicate: ["holdStock"],
    transaction,
  });
};

export const adjustmentStock = async (
  items: { id: number; holdStock: number; stock: number }[],
  transaction: any
) => {
  return await Book.bulkCreate(items, {
    updateOnDuplicate: ["holdStock", "stock"],
    transaction,
  });
};

export const checkStock = async (items: { id: number; quantity: number }[]) => {
  const books = await Book.findAll({
    where: {
      id: items.map((item) => item.id),
    },
  });

  for (const item of items) {
    const book = books.find((b) => b.id === item.id);
    if (!book || book.stock - book.holdStock < item.quantity) {
      return false;
    }
  }

  return true;
};
