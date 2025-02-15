import { db } from "@/db";
import { permission } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all permissions from the database
    const allPermissions = await db.select().from(permission);
    return NextResponse.json(allPermissions, { status: 200 });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while fetching permissions.",
      },
      { status: 500 }
    );
  }
}