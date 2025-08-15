import { NextResponse } from "next/server";
import { db } from '@/lib/db-supabase';
import { CreateDisciplineDTO } from '@/types/supabase';

export async function GET() {
  try {
    const disciplines = await db.disciplines();
    return NextResponse.json({ 
      status: "success",
      data: disciplines 
    });
  } catch (error) {
    console.error('Error fetching disciplines:', error);
    return NextResponse.json({ 
      status: "error",
      message: "Failed to fetch disciplines",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateDisciplineDTO = await request.json();
    
    const discipline = await db.createDiscipline(body);
    
    return NextResponse.json({ 
      status: "success",
      message: "Discipline created successfully",
      data: discipline 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating discipline:', error);
    return NextResponse.json({ 
      status: "error",
      message: "Failed to create discipline",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}