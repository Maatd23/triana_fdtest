import jwt from "jsonwebtoken";
import { env } from "../config/env";
export const signAccess = (p: any) =>
  jwt.sign(p, env.jwtAccess, { expiresIn: "15m" });
export const verifyAccess = (t: string) => jwt.verify(t, env.jwtAccess);
