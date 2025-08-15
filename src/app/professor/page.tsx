"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Bell, 
  BarChart3, 
  BookOpen, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Edit,
  Eye,
  Users,
  FileText,
  Play
} from 'lucide-react';

interface ProfessorDiscipline {
  id: string;
  professor_id: string;
  discipline_id: string;
  assigned_at: string;
  status: 'PENDENTE' | 'EM_PROGRESSO' | 'CONCLUIDA' | 'ATRASADA';
  discipline: {
    id: string;
    code: string;
    name: string;
    course: {
      id: string;
      name: string;
      type: string;
      is_active: boolean;
    };
    status: string;
    workload: number;
    course_id: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    course_type: string;
    last_access: string | null;
    delivery_date: string | null;
    has_ead_hours: boolean;
    is_licenciatura: boolean;
    has_practical_hours: boolean;
    has_presential_exam: boolean;
    needs_presential_tool: boolean;
    has_complementary_eval: boolean;
    has_integrated_project: boolean;
    has_extension_curriculum: boolean;
  };
}

interface Session {
  id: string;
  discipline_id: string;
  name: string;
  type: 'APRESENTACAO' | 'ROTEIRO' | 'AVALIACAO';
  is_completed: boolean;
  order: number;
}

export default function ProfessorDashboard() {
  const router = useRouter();
  const [disciplines, setDisciplines] = useState<ProfessorDiscipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDisciplines();
  }, []);

  const loadDisciplines = async () => {
    try {
      setLoading(true);
      // Usar um ID de professor fixo para demonstração
      // Em um sistema real, isso viria da autenticação
      const professorId = '9da616c8-e6e5-4da5-92cf-55bf7c6f7e0d';
      
      const response = await fetch(`/api/professor/disciplines?professorId=${professorId}`);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar disciplinas');
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setDisciplines(data.data);
      } else {
        throw new Error(data.message || 'Erro ao carregar disciplinas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDENTE: { variant: 'secondary' as const, text: 'Pendente', icon: Clock },
      EM_PROGRESSO: { variant: 'default' as const, text: 'Em Progresso', icon: BarChart3 },
      CONCLUIDA: { variant: 'default' as const, text: 'Concluída', icon: CheckCircle },
      ATRASADA: { variant: 'destructive' as const, text: 'Atrasada', icon: AlertTriangle }
    };

    const { variant, text, icon: Icon } = variants[status as keyof typeof variants] || variants.PENDENTE;
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {text}
      </Badge>
    );
  };

  const getSessionIcon = (type: string, isCompleted: boolean) => {
    const baseIcon = type === 'APRESENTACAO' ? Users : type === 'ROTEIRO' ? BookOpen : FileText;
    const Icon = baseIcon;
    
    return (
      <div className={`p-1 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
        <Icon className="w-3 h-3" />
      </div>
    );
  };

  const filteredDisciplines = disciplines.filter(pd =>
    pd.discipline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pd.discipline.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: disciplines.length,
    inProgress: disciplines.filter(d => d.status === 'EM_PROGRESSO').length,
    completed: disciplines.filter(d => d.status === 'CONCLUIDA').length,
    delayed: disciplines.filter(d => d.status === 'ATRASADA').length,
    pending: disciplines.filter(d => d.status === 'PENDENTE').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel do professor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadDisciplines}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel do Professor</h1>
              <p className="text-gray-600">Acompanhe o progresso das suas disciplinas e prazos de entrega</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notificações
              </Button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Atribuídas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de busca */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar disciplinas ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Lista de Disciplinas */}
        <div className="space-y-4">
          {filteredDisciplines.map((professorDiscipline) => {
            const discipline = professorDiscipline.discipline;
            return (
              <Card key={professorDiscipline.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {discipline.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span>Código: {discipline.code}</span>
                          <span>•</span>
                          <span>{discipline.workload}h</span>
                          <span>•</span>
                          <span>{discipline.course.name}</span>
                          <span>•</span>
                          <span>{discipline.course.type}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(professorDiscipline.status)}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => router.push(`/professor/disciplina/${discipline.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Status da Disciplina</span>
                          <span className="text-sm text-gray-500">
                            {getStatusBadge(discipline.status as string)}
                          </span>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-3">Informações</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Tipo de Curso:</span>
                              <span className="ml-2 font-medium">{discipline.course_type}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Carga Horária:</span>
                              <span className="ml-2 font-medium">{discipline.workload}h</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Atribuída em:</span>
                              <span className="ml-2 font-medium">
                                {new Date(professorDiscipline.assigned_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Status:</span>
                              <span className="ml-2 font-medium">{discipline.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Último Acesso:</span>
                        <span className="font-medium">
                          {discipline.last_access ? new Date(discipline.last_access).toLocaleDateString('pt-BR') : 'Nunca'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Prazo de Entrega:</span>
                        <span className="font-medium">
                          {discipline.delivery_date ? new Date(discipline.delivery_date).toLocaleDateString('pt-BR') : 'Não definido'}
                        </span>
                      </div>
                      <div className="pt-2 space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="sm"
                          onClick={() => router.push(`/professor/disciplina/${discipline.id}`)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Começar Edição
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredDisciplines.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma disciplina encontrada</h3>
              <p className="text-gray-600">Tente ajustar sua busca ou aguarde novas atribuições.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}