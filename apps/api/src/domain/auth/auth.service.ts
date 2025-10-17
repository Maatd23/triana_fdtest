import { prisma } from "../../db/prisma";
import bcrypt from "bcryptjs";
import { randomToken } from "../../utils/crypto";
import { sendMail } from "../../utils/mailer";
import { signAccess } from "../../utils/jwt";
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ResetDto,
} from "../../utils/validators";

const TTL_MIN = 30;

export async function register(input: unknown) {
  const data = RegisterDto.parse(input);
  const email = data.email.toLowerCase().trim();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw { status: 409, message: "Email already in use" };

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { username: data.username, email, passwordHash },
    select: { id: true, username: true, email: true, emailVerified: true },
  });

  // Send verification email (hashed token)
  const raw = randomToken(32);
  const tokenHash = await bcrypt.hash(raw, 12);
  await prisma.emailToken.create({
    data: {
      userId: user.id,
      tokenHash,
      type: "VERIFY_EMAIL",
      expiresAt: new Date(Date.now() + TTL_MIN * 60 * 1000),
    },
  });
  await sendMail(
    user.email,
    "Verify your email",
    `Click to verify (valid ${TTL_MIN}m): ${
      process.env.APP_URL || "http://localhost:3000"
    }/verify-email?token=${raw}`
  );
  return user;
}

export async function login(input: unknown) {
  const data = LoginDto.parse(input);
  const email = data.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 401, message: "Invalid credentials" };

  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) throw { status: 401, message: "Invalid credentials" };

  const access = signAccess({ id: user.id });
  return {
    access_token: access,
    profile: {
      id: user.id,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
    },
  };
}

export async function verifyEmail(token: string) {
  const rows = await prisma.emailToken.findMany({
    where: {
      type: "VERIFY_EMAIL",
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
    take: 25,
  });
  for (const r of rows) {
    const ok = await bcrypt.compare(token, r.tokenHash);
    if (ok) {
      await prisma.user.update({
        where: { id: r.userId },
        data: { emailVerified: true },
      });
      await prisma.emailToken.update({
        where: { id: r.id },
        data: { usedAt: new Date() },
      });
      return true;
    }
  }
  throw { status: 400, message: "Invalid or expired token" };
}

export async function forgotPassword(emailRaw: string) {
  const email = (emailRaw || "").toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });
  // generic response regardless of existence
  if (!user) return;

  const raw = randomToken(32);
  const tokenHash = await bcrypt.hash(raw, 12);
  await prisma.emailToken.create({
    data: {
      userId: user.id,
      tokenHash,
      type: "RESET_PASSWORD",
      expiresAt: new Date(Date.now() + TTL_MIN * 60 * 1000),
    },
  });
  await sendMail(
    email,
    "Reset your password",
    `Reset link (valid ${TTL_MIN}m): ${
      process.env.APP_URL || "http://localhost:3000"
    }/reset-password?token=${raw}`
  );
}

export async function resetPassword(input: unknown) {
  const { token, newPassword } = ResetDto.parse(input);

  const rows = await prisma.emailToken.findMany({
    where: {
      type: "RESET_PASSWORD",
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  for (const r of rows) {
    const ok = await bcrypt.compare(token, r.tokenHash);
    if (ok) {
      const passwordHash = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: r.userId },
        data: { passwordHash },
      });
      await prisma.emailToken.update({
        where: { id: r.id },
        data: { usedAt: new Date() },
      });
      return true;
    }
  }
  throw { status: 400, message: "Invalid or expired token" };
}

export async function changePassword(userId: string, input: unknown) {
  const { currentPassword, newPassword } = ChangePasswordDto.parse(input);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw { status: 401, message: "Unauthorized" };

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) throw { status: 400, message: "Current password incorrect" };

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}
