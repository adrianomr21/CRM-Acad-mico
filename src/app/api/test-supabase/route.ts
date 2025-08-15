import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Testar conexão básica
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      return NextResponse.json({ 
        status: "error",
        message: "Supabase connection failed",
        error: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      status: "success",
      message: "Supabase connection successful",
      data: { count: data }
    });
  } catch (error) {
    console.error('Supabase test error:', error);
    return NextResponse.json({ 
      status: "error",
      message: "Supabase test failed",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}