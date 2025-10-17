import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  if (err?.isJoi) return res.status(400).json({ message: err.message });
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
}
