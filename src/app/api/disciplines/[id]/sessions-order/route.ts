import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db-supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { sessions } = body;

    if (!sessions || !Array.isArray(sessions)) {
      return NextResponse.json(
        { status: "error", message: "Sessões não fornecidas ou formato inválido" },
        { status: 400 }
      );
    }

    // Atualizar a ordem de cada sessão no banco de dados
    for (const session of sessions) {
      const { error } = await db.supabaseAdmin
        .from('sessions')
        .update({ 
          order: session.order,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) {
        console.error('Erro ao atualizar sessão:', error);
        return NextResponse.json(
          { status: "error", message: "Erro ao atualizar ordem das sessões" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      status: "success", 
      message: "Ordem das sessões atualizada com sucesso" 
    });

  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { status: "error", message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}