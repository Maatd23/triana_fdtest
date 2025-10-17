import { Router } from "express";
import * as c from "./auth.controller";
import { auth } from "../../middleware/auth";
import {
  loginLimiter,
  forgotLimiter,
  resetLimiter,
} from "../../middleware/rateLimit";

const r = Router();
r.post("/register", c.register);
r.post("/login", loginLimiter, c.login);
r.get("/verify-email", c.verifyEmail);
r.post("/forgot-password", forgotLimiter, c.forgotPassword);
r.post("/reset-password", resetLimiter, c.resetPassword);
r.post("/change-password", auth, c.changePassword);
export default r;
