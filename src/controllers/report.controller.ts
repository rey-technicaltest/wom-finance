import { reportService } from "../services/ReportService";
import { EXCEPTION_MESSAGE, responseHandler } from "../utils/exceptionMessage";
import { Request, Response } from "express";

export const reportController = async (req: Request, res: Response) => {
  const result = await reportService();

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    result,
  });
};
