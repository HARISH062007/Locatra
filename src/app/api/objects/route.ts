import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const objects = await prisma.object.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(objects);
  } catch (error: any) {
    console.error("Error fetching objects:", error);
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
    const { name, category, heightCm, widthCm, depthCm, weightKg, material, modelUrl } = body;

    const object = await prisma.object.create({
      data: {
        userId: userId,
        name: name || "Scanned Object",
        category: category || "furniture.decor",
        heightCm: heightCm || 100,
        widthCm: widthCm || 60,
        depthCm: depthCm || 60,
        weightKg: weightKg || 10,
        material: material || "Wood",
        modelUrl: modelUrl || "object_asset.glb",
      },
    });

    return NextResponse.json(object, { status: 210 });
  } catch (error: any) {
    console.error("Error creating object:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
