import { NextResponse } from "next/server";
import { db } from '@/lib/db-supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const professorId = searchParams.get('professorId');
    
    if (!professorId) {
      return NextResponse.json({ 
        status: "error",
        message: "Professor ID is required" 
      }, { status: 400 });
    }
    
    const disciplines = await db.getProfessorDisciplines(professorId);
    
    return NextResponse.json({ 
      status: "success",
      data: disciplines 
    });
  } catch (error) {
    console.error('Error fetching professor disciplines:', error);
    return NextResponse.json({ 
      status: "error",
      message: "Failed to fetch professor disciplines",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}