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
    const rooms = await prisma.room.findMany({
      where: {
        project: {
          userId: userId,
        },
      },
      include: {
        spaces: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(rooms);
  } catch (error: any) {
    console.error("Error fetching rooms:", error);
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
    const { name, lengthCm, widthCm, heightCm, meshUrl, spaces } = body;

    // Find or create default project for user
    let project = await prisma.project.findFirst({
      where: { userId: userId },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          userId: userId,
          name: "Default Space Project",
        },
      });
    }

    const room = await prisma.room.create({
      data: {
        projectId: project.id,
        name: name || "New Room Twin",
        lengthCm: lengthCm || 500,
        widthCm: widthCm || 400,
        heightCm: heightCm || 270,
        meshUrl: meshUrl || "room_layout.glb",
        spaces: {
          create: spaces || [
            { label: "Corner A", widthCm: 120, depthCm: 120, positionJson: { x: 0.4, y: 0.0, z: -1.2 } },
            { label: "Wall space B", widthCm: 150, depthCm: 80, positionJson: { x: 1.8, y: 0.0, z: 0.5 } },
          ],
        },
      },
      include: {
        spaces: true,
      },
    });

    return NextResponse.json(room, { status: 210 });
  } catch (error: any) {
    console.error("Error creating room:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
