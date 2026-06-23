import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { fetchBackend } from "@/lib/api";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const scans = await prisma.scan.findMany({
      where: {
        userId: userId,
      },
      include: {
        jobs: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(scans);
  } catch (error: any) {
    console.error("Error fetching scans:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Call the FastAPI backend endpoint
    const backendRes = await fetchBackend("/v1/scans/", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      return NextResponse.json({ error: errText }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating scan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
