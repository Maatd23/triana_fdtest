import rateLimit from "express-rate-limit";
export const loginLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20 });
export const forgotLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 5 });
export const resetLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 10 });
