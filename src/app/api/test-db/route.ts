import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Testar conexão básica
    const { data: usersData, error: usersError } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (usersError) {
      return NextResponse.json({ 
        status: "error",
        message: "Supabase connection failed or tables not created",
        error: usersError.message 
      }, { status: 500 });
    }
    
    // Testar criar usuário
    const testUserEmail = `test-${Date.now()}@example.com`;
    const { data: testUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: testUserEmail,
        name: 'Test User',
        role: 'PROFESSOR',
        is_active: true
      })
      .select()
      .single();
    
    if (insertError) {
      return NextResponse.json({ 
        status: "error",
        message: "Failed to create test user",
        error: insertError.message 
      }, { status: 500 });
    }
    
    // Testar criar curso
    const { data: testCourse, error: courseError } = await supabase
      .from('courses')
      .insert({
        name: 'Test Course',
        description: 'A test course for database testing',
        type: 'GRADUACAO',
        is_active: true
      })
      .select()
      .single();
    
    if (courseError) {
      return NextResponse.json({ 
        status: "error",
        message: "Failed to create test course",
        error: courseError.message 
      }, { status: 500 });
    }
    
    // Testar consultar usuários
    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (queryError) {
      return NextResponse.json({ 
        status: "error",
        message: "Failed to query users",
        error: queryError.message 
      }, { status: 500 });
    }
    
    // Testar consultar cursos
    const { data: courses, error: coursesQueryError } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (coursesQueryError) {
      return NextResponse.json({ 
        status: "error",
        message: "Failed to query courses",
        error: coursesQueryError.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      status: "success",
      message: "Supabase operations successful",
      data: {
        user: testUser,
        course: testCourse,
        users: users,
        courses: courses,
        totalUsers: usersData?.count || 0
      }
    });
  } catch (error) {
    console.error('Supabase test error:', error);
    return NextResponse.json({ 
      status: "error",
      message: "Supabase operations failed",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}