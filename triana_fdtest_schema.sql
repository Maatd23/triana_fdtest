CREATE TABLE "User" (
id text PRIMARY KEY,
username text NOT NULL,
email text UNIQUE NOT NULL,
"passwordHash" text NOT NULL,
role text NOT NULL DEFAULT 'Customer',
"emailVerified" boolean NOT NULL DEFAULT false,
"createdAt" timestamptz NOT NULL DEFAULT now(),
"updatedAt" timestamptz NOT NULL DEFAULT now()
);


CREATE TABLE "EmailToken" (
id text PRIMARY KEY,
"userId" text NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
"tokenHash" text NOT NULL,
type text NOT NULL CHECK (type IN ('VERIFY_EMAIL','RESET_PASSWORD')),
"expiresAt" timestamptz NOT NULL,
"usedAt" timestamptz,
"createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "EmailToken_user_idx" ON "EmailToken"("userId");
CREATE INDEX "EmailToken_exp_idx" ON "EmailToken"("expiresAt");


CREATE TABLE "RefreshToken" (
id text PRIMARY KEY,
"userId" text NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
jti text UNIQUE NOT NULL,
"revokedAt" timestamptz,
"createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "RefreshToken_user_idx" ON "RefreshToken"("userId");


CREATE TABLE "Book" (
id text PRIMARY KEY,
title text NOT NULL,
author text NOT NULL,
description text NOT NULL,
"coverUrl" text,
rating int NOT NULL DEFAULT 0,
"uploadedBy" text NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
"createdAt" timestamptz NOT NULL DEFAULT now(),
"updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "Book_author_idx" ON "Book"(author);
CREATE INDEX "Book_created_idx" ON "Book"("createdAt");
CREATE INDEX "Book_rating_idx" ON "Book"(rating);