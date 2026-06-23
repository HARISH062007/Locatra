import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createHash, randomBytes } from "crypto";

function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(salt + password).digest("hex");
}

export function generateSalt(): string {
  return randomBytes(16).toString("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const salt = generateSalt();
    const passwordHash = `${salt}:${hashPassword(password, salt)}`;

    const user = await prisma.user.create({
      data: {
        name: name || email.split("@")[0],
        email,
        passwordHash,
      },
    });

    // Seed initial project for the new user
    await prisma.project.create({
      data: {
        userId: user.id,
        name: "My Spatial Workspace",
      },
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
