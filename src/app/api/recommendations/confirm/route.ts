import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { fetchBackend } from "@/lib/api";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const backendRes = await fetchBackend("/v1/recommendations/confirm", {
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
    console.error("Error confirming placement:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
