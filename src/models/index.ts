import User from "./User";
import Cart from "./Cart";
import CartDetail from "./CartDetail";
import Book from "./Book";
import TransactionDetail from "./TransactionDetail";
import Order from "./Transaction";

User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

Cart.hasMany(CartDetail, { foreignKey: "cartId", as: "items" });
CartDetail.belongsTo(Cart, { foreignKey: "cartId", as: "items" });

Book.hasMany(CartDetail, { foreignKey: "bookId" });
CartDetail.belongsTo(Book, { foreignKey: "bookId", as: "book" });

Order.hasMany(TransactionDetail, {
  foreignKey: "transactionId",
  as: "details",
});
TransactionDetail.belongsTo(Order, {
  foreignKey: "transactionId",
  as: "transaction",
});

Book.hasMany(TransactionDetail, {
  foreignKey: "bookId",
  as: "transactionDetails",
});
TransactionDetail.belongsTo(Book, { foreignKey: "bookId", as: "book" });

export { User, Cart, CartDetail, Book };
