import { NextResponse } from "next/server";
import { db } from '@/lib/db-supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const discipline = await db.getDisciplineById(id);
    
    return NextResponse.json({ 
      status: "success",
      data: discipline 
    });
  } catch (error) {
    console.error('Error fetching discipline:', error);
    return NextResponse.json({ 
      status: "error",
      message: "Failed to fetch discipline",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Processar os dados para lidar com campos vazios
    const processedData = { ...body };
    
    // Converter string vazia em null para campos de data
    if (processedData.delivery_date === '') {
      processedData.delivery_date = null;
    }
    
    // Remover campos que não devem ser atualizados diretamente
    delete processedData.id;
    delete processedData.created_at;
    delete processedData.updated_at;
    delete processedData.course_id;
    delete processedData.created_by;
    
    const updatedDiscipline = await db.updateDiscipline(id, processedData);
    
    return NextResponse.json({ 
      status: "success",
      message: "Discipline updated successfully",
      data: updatedDiscipline 
    });
  } catch (error) {
    console.error('Error updating discipline:', error);
    return NextResponse.json({ 
      status: "error",
      message: "Failed to update discipline",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}