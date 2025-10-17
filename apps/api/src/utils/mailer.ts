import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: { user: env.smtp.user, pass: env.smtp.pass },
});

export async function sendMail(to: string, subject: string, text: string) {
  await transporter.sendMail({ from: env.smtp.from, to, subject, text });
}
