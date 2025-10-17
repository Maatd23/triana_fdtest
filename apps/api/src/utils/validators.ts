import { z } from "zod";

export const RegisterDto = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const ChangePasswordDto = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

export const ResetDto = z.object({
  token: z
    .string()
    .length(64)
    .regex(/^[a-f0-9]+$/i),
  newPassword: z.string().min(8),
});
