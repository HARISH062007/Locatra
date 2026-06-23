import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { SignJWT, jwtVerify } from "jose";
import { createHash } from "crypto";

function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(salt + password).digest("hex");
}

function verifyPassword(stored: string, input: string): boolean {
  // Support salted "salt:hash" format from signup route
  if (stored.includes(":")) {
    const [salt, hash] = stored.split(":");
    return hashPassword(input, salt) === hash;
  }
  // Legacy: plain-text stored during development
  return stored === input;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // NOTE: No adapter — PrismaAdapter conflicts with Credentials provider + JWT strategy.
  // DB lookups are done manually in authorize() below.
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = user.passwordHash
          ? verifyPassword(user.passwordHash, credentials.password as string)
          : false;

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  jwt: {
    async encode({ secret, token }) {
      const encodedSecret = new TextEncoder().encode(secret as string);
      return await new SignJWT(token as any)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(encodedSecret);
    },
    async decode({ secret, token }) {
      if (!token) return null;
      const encodedSecret = new TextEncoder().encode(secret as string);
      try {
        const { payload } = await jwtVerify(token, encodedSecret, {
          algorithms: ["HS256"],
        });
        return payload as any;
      } catch {
        return null;
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role || "HOMEOWNER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
