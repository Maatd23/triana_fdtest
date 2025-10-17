import { Request, Response } from "express";
import * as users from "./users.service";

export const me = async (req: Request, res: Response) => {
  const id = (req as any).user.id;
  const data = await users.getMe(id);
  return res.json(data);
};

export const list = async (req: Request, res: Response) => {
  const q = req.query.q ? String(req.query.q) : undefined;
  const verified =
    typeof req.query.verified !== "undefined"
      ? String(req.query.verified) === "true"
      : undefined;

  const data = await users.listUsers({ q, verified });
  return res.json(data);
};
