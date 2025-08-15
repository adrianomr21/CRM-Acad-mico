import { createClient } from '@/lib/supabase'
import supabaseAdmin from '@/lib/supabase-admin'
import { 
  User, 
  Course, 
  Discipline, 
  Session, 
  Material, 
  Activity, 
  Evaluation,
  ProfessorDiscipline,
  DisciplineTemplate,
  AdminComment
} from '@/types/supabase'

export const db = {
  // Operações de Usuários
  async users() {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as User[]
  },

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data as User
  },

  async getUserById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as User
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) return null
    return data as User
  },

  // Operações de Cursos
  async courses() {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Course[]
  },

  async createCourse(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert([courseData])
      .select()
      .single()
    
    if (error) throw error
    return data as Course
  },

  // Operações de Disciplinas
  async disciplines() {
    const { data, error } = await supabaseAdmin
      .from('disciplines')
      .select(`
        *,
        course:courses(*),
        created_by_user:users(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as (Discipline & { course: Course; created_by_user: User })[]
  },

  async createDiscipline(disciplineData: Omit<Discipline, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('disciplines')
      .insert([disciplineData])
      .select()
      .single()
    
    if (error) throw error
    return data as Discipline
  },

  async updateDiscipline(id: string, updates: Partial<Discipline>) {
    const { data, error } = await supabaseAdmin
      .from('disciplines')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Discipline
  },

  async getDisciplineById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('disciplines')
      .select(`
        *,
        course:courses(*),
        created_by_user:users(*),
        sessions:sessions(*),
        templates:discipline_templates(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    // Buscar materiais, atividades e avaliações separadamente
    const [materials, activities, evaluations] = await Promise.all([
      supabaseAdmin
        .from('materials')
        .select('*')
        .in('session_id', data.sessions.map((s: any) => s.id)),
      
      supabaseAdmin
        .from('activities')
        .select('*')
        .in('session_id', data.sessions.map((s: any) => s.id)),
      
      supabaseAdmin
        .from('evaluations')
        .select('*')
        .in('session_id', data.sessions.map((s: any) => s.id))
    ]);

    return {
      ...data,
      materials: materials.data || [],
      activities: activities.data || [],
      evaluations: evaluations.data || []
    } as Discipline & { 
      course: Course; 
      created_by_user: User; 
      sessions: Session[]; 
      templates: DisciplineTemplate[];
      materials: Material[];
      activities: Activity[];
      evaluations: Evaluation[];
    };
  },

  // Operações de Professor-Disciplina
  async getProfessorDisciplines(professorId: string) {
    const { data, error } = await supabaseAdmin
      .from('professor_disciplines')
      .select(`
        *,
        discipline:disciplines(*, course:courses(*))
      `)
      .eq('professor_id', professorId)
      .order('assigned_at', { ascending: false })
    
    if (error) throw error
    return data as (ProfessorDiscipline & { discipline: Discipline & { course: Course } })[]
  },

  async assignProfessorToDiscipline(professorId: string, disciplineId: string) {
    const { data, error } = await supabaseAdmin
      .from('professor_disciplines')
      .insert([{
        professor_id: professorId,
        discipline_id: disciplineId
      }])
      .select()
      .single()
    
    if (error) throw error
    return data as ProfessorDiscipline
  },

  // Operações de Sessões
  async getSessionsByDiscipline(disciplineId: string) {
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .select('*')
      .eq('discipline_id', disciplineId)
      .order('order', { ascending: true })
    
    if (error) throw error
    return data as Session[]
  },

  async createSession(sessionData: Omit<Session, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .insert([sessionData])
      .select()
      .single()
    
    if (error) throw error
    return data as Session
  },

  async updateSession(id: string, updates: Partial<Session>) {
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Session
  },

  // Operações de Templates
  async getTemplatesByDiscipline(disciplineId: string) {
    const { data, error } = await supabaseAdmin
      .from('discipline_templates')
      .select('*')
      .eq('discipline_id', disciplineId)
    
    if (error) throw error
    return data as DisciplineTemplate[]
  },

  async createTemplate(templateData: Omit<DisciplineTemplate, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('discipline_templates')
      .insert([templateData])
      .select()
      .single()
    
    if (error) throw error
    return data as DisciplineTemplate
  },

  // Operações de Materiais
  async getMaterialsBySession(sessionId: string) {
    const { data, error } = await supabaseAdmin
      .from('materials')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data as Material[]
  },

  async createMaterial(materialData: Omit<Material, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('materials')
      .insert([materialData])
      .select()
      .single()
    
    if (error) throw error
    return data as Material
  },

  // Operações de Atividades
  async getActivitiesBySession(sessionId: string) {
    const { data, error } = await supabaseAdmin
      .from('activities')
      .select('*')
      .eq('session_id', sessionId)
      .order('order', { ascending: true })
    
    if (error) throw error
    return data as Activity[]
  },

  async createActivity(activityData: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('activities')
      .insert([activityData])
      .select()
      .single()
    
    if (error) throw error
    return data as Activity
  },

  // Operações de Avaliações
  async getEvaluationsBySession(sessionId: string) {
    const { data, error } = await supabaseAdmin
      .from('evaluations')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data as Evaluation[]
  },

  async createEvaluation(evaluationData: Omit<Evaluation, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('evaluations')
      .insert([evaluationData])
      .select()
      .single()
    
    if (error) throw error
    return data as Evaluation
  },

  // Operações de Comentários Administrativos
  async getAdminComments(disciplineId?: string, sessionId?: string) {
    let query = supabaseAdmin
      .from('admin_comments')
      .select(`
        *,
        user:users(*)
      `)
    
    if (disciplineId) {
      query = query.eq('discipline_id', disciplineId)
    }
    
    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data as (AdminComment & { user: User })[]
  },

  async createAdminComment(commentData: Omit<AdminComment, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('admin_comments')
      .insert([commentData])
      .select(`
        *,
        user:users(*)
      `)
      .single()
    
    if (error) throw error
    return data as AdminComment & { user: User }
  },

  // Adicionar propriedade para acesso direto ao supabaseAdmin
  supabaseAdmin
}