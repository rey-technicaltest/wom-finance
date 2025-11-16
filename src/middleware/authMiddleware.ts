import { convertObject } from "./../utils/tools";
import User from "../models/User";
import { verifyToken } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Missing token" });

    if (authHeader.split(" ")[1] != "Bearer") {
      return res.status(401).json({
        message: "Invalid token format",
        code: "INVALID_TOKEN_FORMAT",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.currentToken !== token) {
      return res.status(401).json({
        message: "Token has been invalidated",
        code: "FORCED_LOGOUT",
      });
    }

    if (user.deviceId !== decoded.deviceId) {
      return res.status(401).json({
        message: "Your account is logged in from another device",
        code: "FORCED_LOGOUT",
      });
    }

    req.body = {
      ...req.body,
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
