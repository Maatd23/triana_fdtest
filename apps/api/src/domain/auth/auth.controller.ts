import { Request, Response } from "express";
import * as svc from "./auth.service";

export const register = async (req: Request, res: Response) => {
  await svc.register(req.body);
  return res
    .status(201)
    .json({ message: "Registered. Please verify your email." });
};

export const login = async (req: Request, res: Response) => {
  const data = await svc.login(req.body);
  return res.json(data);
};

export const verifyEmail = async (req: Request, res: Response) => {
  await svc.verifyEmail(String(req.query.token));
  return res.json({ message: "Email verified" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  await svc.forgotPassword(req.body?.email || "");
  return res.json({ message: "If that email exists, we sent a reset link." });
};

export const resetPassword = async (req: Request, res: Response) => {
  await svc.resetPassword(req.body);
  return res.json({ message: "Password has been reset" });
};

export const changePassword = async (req: Request, res: Response) => {
  await svc.changePassword((req as any).user.id, req.body);
  return res.json({ message: "Password changed" });
};
