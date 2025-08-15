// Tipos base para as tabelas do Supabase

export interface User {
  id: string
  email: string
  name?: string
  role: 'ADMIN' | 'PROFESSOR'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  name: string
  description?: string
  type: 'GRADUACAO' | 'POS_GRADUACAO' | 'EXTENSAO' | 'EAD' | 'INSTITUCIONAL'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Discipline {
  id: string
  name: string
  code: string
  workload: number
  course_type: 'GRADUACAO' | 'POS_GRADUACAO' | 'EXTENSAO' | 'EAD' | 'INSTITUCIONAL'
  course_id: string
  has_ead_hours: boolean
  has_practical_hours: boolean
  has_integrated_project: boolean
  has_presential_exam: boolean
  is_licenciatura: boolean
  has_complementary_eval: boolean
  has_extension_curriculum: boolean
  needs_presential_tool: boolean
  status: 'CRIADA' | 'ATRIBUIDA' | 'EM_PROGRESSO' | 'CONCLUIDA' | 'ATRASADA'
  delivery_date?: string
  last_access?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface ProfessorDiscipline {
  id: string
  professor_id: string
  discipline_id: string
  assigned_at: string
  status: 'PENDENTE' | 'EM_PROGRESSO' | 'CONCLUIDA' | 'ATRASADA'
}

export interface Session {
  id: string
  discipline_id: string
  name: string
  type: 'APRESENTACAO' | 'ROTEIRO' | 'AVALIACAO'
  order: number
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface DisciplineTemplate {
  id: string
  discipline_id: string
  session_name: string
  numbering_type: 'NUMBERS' | 'LETTERS' | 'ROMAN'
  min_author_materials: number
  min_study_activities: number
  min_evaluations: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Material {
  id: string
  session_id: string
  name: string
  type: 'BASICO' | 'COMPLEMENTAR'
  is_authorial: boolean
  used_ai: boolean
  ai_tool?: string
  ai_usage?: string
  description?: string
  file_url?: string
  link_url?: string
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  session_id: string
  type: 'QUESTIONARIO' | 'TAREFA' | 'FORUM'
  title: string
  guidance: string
  order: number
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  activity_id: string
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  correct_answer: string
  wrong_answer1: string
  wrong_answer2: string
  wrong_answer3: string
  wrong_answer4: string
  feedback?: string
  order: number
  created_at: string
  updated_at: string
}

export interface Assignment {
  id: string
  activity_id: string
  question: string
  expected_answer?: string
  file_url?: string
  feedback?: string
  created_at: string
  updated_at: string
}

export interface Forum {
  id: string
  activity_id: string
  statement: string
  created_at: string
  updated_at: string
}

export interface Evaluation {
  id: string
  session_id: string
  type: 'DISSERTATIVA' | 'OBJETIVA'
  guidance: string
  file_url?: string
  created_at: string
  updated_at: string
}

export interface EssayQuestion {
  id: string
  evaluation_id: string
  question: string
  expected_answer?: string
  feedback?: string
  file_url?: string
  order: number
  created_at: string
  updated_at: string
}

export interface MCQuestion {
  id: string
  evaluation_id: string
  question: string
  correct_answer: string
  wrong_answer1: string
  wrong_answer2: string
  wrong_answer3: string
  wrong_answer4: string
  feedback?: string
  order: number
  created_at: string
  updated_at: string
}

export interface Extra {
  id: string
  session_id: string
  type: 'SAIBA_MAIS' | 'ATENCAO' | 'PARA_REFLETIR'
  description: string
  file_url?: string
  created_at: string
  updated_at: string
}

export interface AdminComment {
  id: string
  user_id: string
  discipline_id?: string
  session_id?: string
  content: string
  created_at: string
  updated_at: string
}

// Tipos combinados para uso nas interfaces
export interface DisciplineWithRelations extends Discipline {
  course?: Course
  created_by_user?: User
  sessions?: Session[]
  templates?: DisciplineTemplate[]
  professor_disciplines?: (ProfessorDiscipline & { professor: User })[]
}

export interface SessionWithRelations extends Session {
  discipline?: Discipline
  materials?: Material[]
  activities?: (Activity & {
    quiz?: Quiz & { questions: QuizQuestion[] }
    assignment?: Assignment
    forum?: Forum
  })[]
  evaluations?: (Evaluation & {
    essay_questions?: EssayQuestion[]
    mc_questions?: MCQuestion[]
  })[]
  extras?: Extra[]
  admin_comments?: (AdminComment & { user: User })[]
}

export interface ProfessorDisciplineWithRelations extends ProfessorDiscipline {
  professor?: User
  discipline?: DisciplineWithRelations
}

// Tipos para formulários e DTOs
export interface CreateDisciplineDTO {
  name: string
  code: string
  workload: number
  course_type: Discipline['course_type']
  course_id: string
  has_ead_hours?: boolean
  has_practical_hours?: boolean
  has_integrated_project?: boolean
  has_presential_exam?: boolean
  is_licenciatura?: boolean
  has_complementary_eval?: boolean
  has_extension_curriculum?: boolean
  needs_presential_tool?: boolean
  delivery_date?: string
}

export interface UpdateDisciplineDTO extends Partial<CreateDisciplineDTO> {
  status?: Discipline['status']
}

export interface CreateTemplateDTO {
  discipline_id: string
  session_name: string
  numbering_type: DisciplineTemplate['numbering_type']
  min_author_materials: number
  min_study_activities: number
  min_evaluations: number
  is_active?: boolean
}

export interface CreateSessionDTO {
  discipline_id: string
  name: string
  type: Session['type']
  order: number
}

export interface CreateMaterialDTO {
  session_id: string
  name: string
  type: Material['type']
  is_authorial?: boolean
  used_ai?: boolean
  ai_tool?: string
  ai_usage?: string
  description?: string
  file_url?: string
  link_url?: string
}

export interface CreateActivityDTO {
  session_id: string
  type: Activity['type']
  title: string
  guidance: string
  order: number
}

export interface CreateEvaluationDTO {
  session_id: string
  type: Evaluation['type']
  guidance: string
  file_url?: string
}