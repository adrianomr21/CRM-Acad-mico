import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function GET() {
  try {
    // 检查数据库连接
    await db.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: "healthy",
      message: "Good!",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        server: "running",
        websocket: "available"
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      status: "unhealthy",
      message: "Database connection failed",
      timestamp: new Date().toISOString(),
      services: {
        database: "disconnected",
        server: "running",
        websocket: "available"
      }
    }, { status: 500 });
  }
}