import { db } from "@/db";
import { permission } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    // Check if the permission already exists
    const existingPermission = await db
      .select()
      .from(permission)
      .where(eq(permission.name, name));

    if (existingPermission.length > 0) {
      return NextResponse.json(
        { error: "Permission already exists." },
        { status: 400 }
      );
    }

    // Insert new permission
    await db.insert(permission).values({ name, description });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error adding permission:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
