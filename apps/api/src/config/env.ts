import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 4000),
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:4000',
  jwtAccess: process.env.JWT_ACCESS_SECRET!,
  jwtRefresh: process.env.JWT_REFRESH_SECRET!,
  rateWindow: Number(process.env.RATE_LIMIT_WINDOW || 10 * 60 * 1000),
  rateMax: Number(process.env.RATE_LIMIT_MAX || 100),
  smtp: {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
    from: process.env.MAIL_FROM || 'no-reply@yourapp.com',
  }
};
