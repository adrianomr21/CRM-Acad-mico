"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  BarChart3, 
  Users, 
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Settings,
  FileText,
  Eye,
  Edit
} from 'lucide-react';

interface Discipline {
  id: string;
  name: string;
  code: string;
  workload: number;
  courseType: string;
  professor: string;
  status: 'criada' | 'atribuida' | 'em_progresso' | 'concluida' | 'atrasada';
  deliveryDate?: string;
  lastAccess?: string;
  progress: number;
  sessions: Session[];
}

interface Session {
  id: string;
  name: string;
  type: 'apresentacao' | 'roteiro' | 'avaliacao';
  isCompleted: boolean;
  order: number;
}

export default function AdminDashboard() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simular carregamento de dados
    const mockData: Discipline[] = [
      {
        id: '1',
        name: 'Programação Web',
        code: 'PW101',
        workload: 80,
        courseType: 'Graduação',
        professor: 'Dr. João Silva',
        status: 'em_progresso',
        deliveryDate: '2024-12-15',
        lastAccess: '2024-12-01',
        progress: 65,
        sessions: [
          { id: '1', name: 'Apresentação', type: 'apresentacao', isCompleted: true, order: 1 },
          { id: '2', name: 'Roteiro 1', type: 'roteiro', isCompleted: true, order: 2 },
          { id: '3', name: 'Roteiro 2', type: 'roteiro', isCompleted: false, order: 3 },
          { id: '4', name: 'Avaliação 1', type: 'avaliacao', isCompleted: false, order: 4 }
        ]
      },
      {
        id: '2',
        name: 'Banco de Dados',
        code: 'BD201',
        workload: 60,
        courseType: 'Graduação',
        professor: 'Dra. Maria Santos',
        status: 'concluida',
        deliveryDate: '2024-11-30',
        lastAccess: '2024-11-29',
        progress: 100,
        sessions: [
          { id: '5', name: 'Apresentação', type: 'apresentacao', isCompleted: true, order: 1 },
          { id: '6', name: 'Roteiro 1', type: 'roteiro', isCompleted: true, order: 2 },
          { id: '7', name: 'Avaliação 1', type: 'avaliacao', isCompleted: true, order: 3 }
        ]
      },
      {
        id: '3',
        name: 'Inteligência Artificial',
        code: 'IA301',
        workload: 120,
        courseType: 'Pós-graduação',
        professor: 'Dr. Pedro Oliveira',
        status: 'atrasada',
        deliveryDate: '2024-11-15',
        lastAccess: '2024-11-10',
        progress: 30,
        sessions: [
          { id: '8', name: 'Apresentação', type: 'apresentacao', isCompleted: true, order: 1 },
          { id: '9', name: 'Roteiro 1', type: 'roteiro', isCompleted: false, order: 2 }
        ]
      }
    ];

    setTimeout(() => {
      setDisciplines(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      criada: { variant: 'secondary' as const, text: 'Criada', icon: Clock },
      atribuida: { variant: 'outline' as const, text: 'Atribuída', icon: User },
      em_progresso: { variant: 'default' as const, text: 'Em Progresso', icon: BarChart3 },
      concluida: { variant: 'default' as const, text: 'Concluída', icon: CheckCircle },
      atrasada: { variant: 'destructive' as const, text: 'Atrasada', icon: AlertTriangle }
    };

    const { variant, text, icon: Icon } = variants[status as keyof typeof variants];
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {text}
      </Badge>
    );
  };

  const getSessionIcon = (type: string, isCompleted: boolean) => {
    const baseIcon = type === 'apresentacao' ? Users : type === 'roteiro' ? BookOpen : FileText;
    const Icon = baseIcon;
    
    return (
      <div className={`p-1 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
        <Icon className="w-3 h-3" />
      </div>
    );
  };

  const filteredDisciplines = disciplines.filter(discipline =>
    discipline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discipline.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discipline.professor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: disciplines.length,
    inProgress: disciplines.filter(d => d.status === 'em_progresso').length,
    completed: disciplines.filter(d => d.status === 'concluida').length,
    delayed: disciplines.filter(d => d.status === 'atrasada').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gestão de disciplinas e acompanhamento de progresso</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Disciplinas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
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
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.delayed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de ações */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar disciplinas, código ou professor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Disciplina
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        {/* Lista de Disciplinas */}
        <div className="space-y-4">
          {filteredDisciplines.map((discipline) => (
            <Card key={discipline.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-xl">{discipline.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>Código: {discipline.code}</span>
                        <span>•</span>
                        <span>{discipline.workload}h</span>
                        <span>•</span>
                        <span>{discipline.courseType}</span>
                        <span>•</span>
                        <span>Prof: {discipline.professor}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(discipline.status)}
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button variant="outline" size="sm">
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
                        <span className="text-sm font-medium">Progresso Total</span>
                        <span className="text-sm text-gray-500">{discipline.progress}%</span>
                      </div>
                      <Progress value={discipline.progress} className="h-2" />
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-3">Sessões</h4>
                        <div className="flex flex-wrap gap-2">
                          {discipline.sessions.map((session) => (
                            <div
                              key={session.id}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                                session.isCompleted 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {getSessionIcon(session.type, session.isCompleted)}
                              <span>{session.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status da Entrega:</span>
                      <span className="font-medium">
                        {discipline.deliveryDate ? new Date(discipline.deliveryDate).toLocaleDateString('pt-BR') : 'Não definida'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Último Acesso:</span>
                      <span className="font-medium">
                        {discipline.lastAccess ? new Date(discipline.lastAccess).toLocaleDateString('pt-BR') : 'Nunca'}
                      </span>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" className="w-full" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar Template
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDisciplines.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma disciplina encontrada</h3>
              <p className="text-gray-600 mb-4">Tente ajustar sua busca ou crie uma nova disciplina.</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Disciplina
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}