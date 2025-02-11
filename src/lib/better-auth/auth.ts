import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import logger from "@/lib/logger";
import argon2 from "argon2";
import { MAIL_USER } from "@/lib/constants/env";
import transporter from "@/lib/mailer";
import { db } from "@/db";
import { schema } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    password: {
      hash: async (password) => {
        return await argon2.hash(password);
      },
      verify: async ({ password, hash }) => {
        return await argon2.verify(hash, password);
      },
    },
    sendResetPassword: async ({ user, url }) => {
      await transporter.sendMail({
        from: `"Authenty" <${MAIL_USER}>`,
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await transporter.sendMail({
        from: `"Authenty" <${MAIL_USER}>`,
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
        html: `<p>Click the link to verify your email: <a href="${url}">${url}</a></p>`,
      });
    },
  },

  plugins: [nextCookies()],
  logger: {
    log: (level, message, ...args) => {
      switch (level) {
        case "info":
          logger.info(message, ...args);
          break;
        case "warn":
          logger.warn(message, ...args);
          break;
        case "error":
          logger.error(message, ...args);
          break;
        case "debug":
          logger.debug(message, ...args);
          break;
        default:
          logger.info(message, ...args);
          break;
      }
    },
  },
});
