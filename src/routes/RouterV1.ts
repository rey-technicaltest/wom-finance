import { login } from "../controllers/auth.controller";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { addUserController } from "../controllers/users.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  addBookController,
  getBooksController,
  updateBookController,
} from "../controllers/book.controller";
import {
  addCartItemsController,
  deleteCartItemsController,
  getCartItemController,
  updateCartItemsController,
} from "../controllers/cart.controller";
import { allowRoles } from "../middleware/roleMiddleware";
import {
  checkoutController,
  getTransactionController,
  paymentCallbackController,
} from "../controllers/order.controller";
import { reportController } from "../controllers/report.controller";

const express = require("express");
const router = express.Router();

router.post("/auth", asyncHandler(login));

//users
router.post("/users", asyncHandler(addUserController));

//Books
router.get("/books", authMiddleware, asyncHandler(getBooksController));

router.post(
  "/books",
  authMiddleware,
  allowRoles("admin"),
  asyncHandler(addBookController)
);

router.put(
  "/books",
  authMiddleware,
  allowRoles("admin"),
  asyncHandler(updateBookController)
);

//carts
router.get("/carts", authMiddleware, asyncHandler(getCartItemController));
router.post("/carts", authMiddleware, asyncHandler(addCartItemsController));
router.patch("/carts", authMiddleware, asyncHandler(updateCartItemsController));
router.delete(
  "/carts",
  authMiddleware,
  asyncHandler(deleteCartItemsController)
);

//Transactions
router.get(
  "/transactions",
  authMiddleware,
  allowRoles("admin"),
  asyncHandler(getTransactionController)
);
router.post("/checkout", authMiddleware, asyncHandler(checkoutController));

//Payments
router.post("/payments/callback", asyncHandler(paymentCallbackController));

//Report
router.get(
  "/report",
  authMiddleware,
  allowRoles("admin"),
  asyncHandler(reportController)
);

router.get("*", function (req: Request, res: Response) {
  res.status(404).json();
});

module.exports = router;
