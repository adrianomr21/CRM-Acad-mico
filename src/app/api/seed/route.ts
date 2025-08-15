import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export async function POST() {
  try {
    await seedDatabase();
    return NextResponse.json({ 
      status: "success",
      message: "Database seeded successfully"
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      status: "error",
      message: "Failed to seed database",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}