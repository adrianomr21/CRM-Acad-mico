import { db } from './db-supabase';

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Criar usuário de teste
    const user = await db.createUser({
      name: 'Professor Teste',
      email: 'professor@teste.com',
      role: 'PROFESSOR'
    });

    console.log('User created:', user);

    // Criar curso de teste
    const course = await db.createCourse({
      name: 'Engenharia de Software',
      description: 'Curso de Engenharia de Software',
      type: 'GRADUACAO'
    });

    console.log('Course created:', course);

    // Criar disciplina de teste
    const discipline = await db.createDiscipline({
      name: 'Programação Web',
      code: 'PW-001',
      workload: 60,
      course_type: 'GRADUACAO',
      course_id: course.id,
      created_by: user.id
    });

    console.log('Discipline created:', discipline);

    // Criar sessão de estudo
    const session = await db.createSession({
      discipline_id: discipline.id,
      name: 'Sessão 1 - Introdução',
      type: 'APRESENTACAO',
      order: 1
    });

    console.log('Session created:', session);

    // Criar template para a disciplina
    const template = await db.createTemplate({
      discipline_id: discipline.id,
      session_name: 'Aula Padrão',
      numbering_type: 'NUMBERS',
      min_author_materials: 3,
      min_study_activities: 2,
      min_evaluations: 1
    });

    console.log('Template created:', template);

    // Criar material para a sessão
    const material = await db.createMaterial({
      session_id: session.id,
      name: 'Material de Apoio - Introdução',
      type: 'BASICO',
      description: 'Material de apoio para a primeira aula'
    });

    console.log('Material created:', material);

    // Criar atividade para a sessão
    const activity = await db.createActivity({
      session_id: session.id,
      type: 'QUESTIONARIO',
      title: 'Questionário Diagnóstico',
      guidance: 'Responda às questões para verificar seus conhecimentos prévios',
      order: 1
    });

    console.log('Activity created:', activity);

    // Criar avaliação para a sessão
    const evaluation = await db.createEvaluation({
      session_id: session.id,
      type: 'DISSERTATIVA',
      guidance: 'Elabore uma redação sobre os conceitos fundamentais de programação web'
    });

    console.log('Evaluation created:', evaluation);

    // Atribuir professor à disciplina
    const professorAssignment = await db.assignProfessorToDiscipline(user.id, discipline.id);

    console.log('Professor assigned:', professorAssignment);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}