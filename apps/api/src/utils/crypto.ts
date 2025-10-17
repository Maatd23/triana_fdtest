import crypto from "crypto";
export const randomToken = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
