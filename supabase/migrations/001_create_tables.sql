-- Criar tabela de usuários
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'PROFESSOR' CHECK (role IN ('ADMIN', 'PROFESSOR')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de cursos
CREATE TABLE courses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('GRADUACAO', 'POS_GRADUACAO', 'EXTENSAO', 'EAD', 'INSTITUCIONAL')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de disciplinas
CREATE TABLE disciplines (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    workload INTEGER NOT NULL,
    course_type TEXT NOT NULL CHECK (course_type IN ('GRADUACAO', 'POS_GRADUACAO', 'EXTENSAO', 'EAD', 'INSTITUCIONAL')),
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    has_ead_hours BOOLEAN DEFAULT false,
    has_practical_hours BOOLEAN DEFAULT false,
    has_integrated_project BOOLEAN DEFAULT false,
    has_presential_exam BOOLEAN DEFAULT false,
    is_licenciatura BOOLEAN DEFAULT false,
    has_complementary_eval BOOLEAN DEFAULT false,
    has_extension_curriculum BOOLEAN DEFAULT false,
    needs_presential_tool BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'CRIADA' CHECK (status IN ('CRIADA', 'ATRIBUIDA', 'EM_PROGRESSO', 'CONCLUIDA', 'ATRASADA')),
    delivery_date TIMESTAMP WITH TIME ZONE,
    last_access TIMESTAMP WITH TIME ZONE,
    created_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de relacionamento professor-disciplina
CREATE TABLE professor_disciplines (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    professor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    discipline_id TEXT NOT NULL REFERENCES disciplines(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'EM_PROGRESSO', 'CONCLUIDA', 'ATRASADA')),
    UNIQUE(professor_id, discipline_id)
);

-- Criar tabela de sessões
CREATE TABLE sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    discipline_id TEXT NOT NULL REFERENCES disciplines(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('APRESENTACAO', 'ROTEIRO', 'AVALIACAO')),
    "order" INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de templates de disciplina
CREATE TABLE discipline_templates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    discipline_id TEXT NOT NULL REFERENCES disciplines(id) ON DELETE CASCADE,
    session_name TEXT NOT NULL,
    numbering_type TEXT NOT NULL CHECK (numbering_type IN ('NUMBERS', 'LETTERS', 'ROMAN')),
    min_author_materials INTEGER NOT NULL DEFAULT 3,
    min_study_activities INTEGER NOT NULL DEFAULT 2,
    min_evaluations INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de materiais
CREATE TABLE materials (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('BASICO', 'COMPLEMENTAR')),
    is_authorial BOOLEAN DEFAULT false,
    used_ai BOOLEAN DEFAULT false,
    ai_tool TEXT,
    ai_usage TEXT,
    description TEXT,
    file_url TEXT,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de atividades
CREATE TABLE activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('QUESTIONARIO', 'TAREFA', 'FORUM')),
    title TEXT NOT NULL,
    guidance TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de quizzes
CREATE TABLE quizzes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id TEXT UNIQUE NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de questões de quiz
CREATE TABLE quiz_questions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    wrong_answer1 TEXT NOT NULL,
    wrong_answer2 TEXT NOT NULL,
    wrong_answer3 TEXT NOT NULL,
    wrong_answer4 TEXT NOT NULL,
    feedback TEXT,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de tarefas
CREATE TABLE assignments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id TEXT UNIQUE NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    expected_answer TEXT,
    file_url TEXT,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de fóruns
CREATE TABLE forums (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id TEXT UNIQUE NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de avaliações
CREATE TABLE evaluations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('DISSERTATIVA', 'OBJETIVA')),
    guidance TEXT NOT NULL,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de questões dissertativas
CREATE TABLE essay_questions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id TEXT NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    expected_answer TEXT,
    feedback TEXT,
    file_url TEXT,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de questões de múltipla escolha
CREATE TABLE mc_questions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id TEXT NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    wrong_answer1 TEXT NOT NULL,
    wrong_answer2 TEXT NOT NULL,
    wrong_answer3 TEXT NOT NULL,
    wrong_answer4 TEXT NOT NULL,
    feedback TEXT,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de extras
CREATE TABLE extras (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('SAIBA_MAIS', 'ATENCAO', 'PARA_REFLETIR')),
    description TEXT NOT NULL,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de comentários administrativos
CREATE TABLE admin_comments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    discipline_id TEXT REFERENCES disciplines(id) ON DELETE CASCADE,
    session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhorar performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_disciplines_code ON disciplines(code);
CREATE INDEX idx_disciplines_course_id ON disciplines(course_id);
CREATE INDEX idx_disciplines_created_by ON disciplines(created_by);
CREATE INDEX idx_sessions_discipline_id ON sessions(discipline_id);
CREATE INDEX idx_materials_session_id ON materials(session_id);
CREATE INDEX idx_activities_session_id ON activities(session_id);
CREATE INDEX idx_evaluations_session_id ON evaluations(session_id);
CREATE INDEX idx_professor_disciplines_professor_id ON professor_disciplines(professor_id);
CREATE INDEX idx_professor_disciplines_discipline_id ON professor_disciplines(discipline_id);
CREATE INDEX idx_admin_comments_user_id ON admin_comments(user_id);
CREATE INDEX idx_admin_comments_discipline_id ON admin_comments(discipline_id);
CREATE INDEX idx_admin_comments_session_id ON admin_comments(session_id);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disciplines_updated_at BEFORE UPDATE ON disciplines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON quiz_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forums_updated_at BEFORE UPDATE ON forums FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_essay_questions_updated_at BEFORE UPDATE ON essay_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mc_questions_updated_at BEFORE UPDATE ON mc_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_extras_updated_at BEFORE UPDATE ON extras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_comments_updated_at BEFORE UPDATE ON admin_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();