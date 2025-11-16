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
