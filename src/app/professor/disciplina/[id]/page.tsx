"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Save, 
  Eye, 
  Edit, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BookOpen,
  Users,
  FileText,
  Settings,
  ArrowLeft,
  Plus,
  Calendar,
  Target,
  Menu,
  X,
  MessageSquare,
  FileQuestion,
  Upload,
  HelpCircle,
  Lightbulb,
  Info,
  GripVertical,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface Session {
  id: string;
  name: string;
  type: 'APRESENTACAO' | 'ROTEIRO' | 'AVALIACAO';
  order: number;
  is_completed: boolean;
  content?: string;
  materials: Material[];
  activities: Activity[];
  extras: Extra[];
  avaliacoes: Avaliacao[];
}

interface Material {
  id: string;
  name: string;
  type: 'BASICO' | 'COMPLEMENTAR';
  description?: string;
  file_url?: string;
  link_url?: string;
}

interface Activity {
  id: string;
  type: 'FORUM' | 'TAREFA' | 'QUESTIONARIO';
  title: string;
  description: string;
  order: number;
}

interface Extra {
  id: string;
  type: 'REFLETIR' | 'ATENCAO' | 'SAIBA_MAIS';
  title: string;
  content: string;
  order: number;
}

interface Avaliacao {
  id: string;
  tipo: 'DISSERTATIVA' | 'OBJETIVA' | 'PRATICA';
  titulo: string;
  descricao: string;
  data: string;
  peso: number;
}

interface Discipline {
  id: string;
  name: string;
  code: string;
  workload: number;
  course_type: string;
  status: 'CRIADA' | 'ATRIBUIDA' | 'EM_PROGRESSO' | 'CONCLUIDA' | 'ATRASADA';
  delivery_date?: string;
  progress: number;
  sessions: Session[];
}

export default function DisciplineEditPage() {
  const params = useParams();
  const router = useRouter();
  const disciplineId = params.id as string;
  
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSession, setActiveSession] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [newSessionType, setNewSessionType] = useState<'APRESENTACAO' | 'ROTEIRO' | 'AVALIACAO'>('APRESENTACAO');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (disciplineId) {
      loadDiscipline();
    }
  }, [disciplineId]);

  const loadDiscipline = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/disciplines/${disciplineId}`);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar disciplina');
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        const disciplineData = data.data;
        // Transformar os dados para o formato esperado
        const transformedDiscipline: Discipline = {
          id: disciplineData.id,
          name: disciplineData.name,
          code: disciplineData.code,
          workload: disciplineData.workload,
          course_type: disciplineData.course_type,
          status: disciplineData.status,
          delivery_date: disciplineData.delivery_date,
          progress: 50, // Calcular baseado nas sessões concluídas
          sessions: disciplineData.sessions || []
        };
        
        setDiscipline(transformedDiscipline);
        if (transformedDiscipline.sessions.length > 0) {
          setActiveSession(transformedDiscipline.sessions[0].id);
        }
      } else {
        throw new Error(data.message || 'Erro ao carregar disciplina');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      CRIADA: { variant: 'secondary' as const, text: 'Criada', icon: Clock },
      ATRIBUIDA: { variant: 'default' as const, text: 'Atribuída', icon: Users },
      EM_PROGRESSO: { variant: 'default' as const, text: 'Em Progresso', icon: Target },
      CONCLUIDA: { variant: 'default' as const, text: 'Concluída', icon: CheckCircle },
      ATRASADA: { variant: 'destructive' as const, text: 'Atrasada', icon: AlertTriangle }
    };

    const { variant, text, icon: Icon } = variants[status as keyof typeof variants] || variants.CRIADA;
    
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

  const getSessionTypeLabel = (type: string) => {
    const labels = {
      'APRESENTACAO': 'Apresentação',
      'ROTEIRO': 'Roteiro/Temática',
      'AVALIACAO': 'Avaliação'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const createNewSession = async () => {
    if (!discipline) return;

    try {
      const newSession: Session = {
        id: `session-${Date.now()}`,
        name: `${getSessionTypeLabel(newSessionType)} ${discipline.sessions.length + 1}`,
        type: newSessionType,
        order: discipline.sessions.length + 1,
        is_completed: false,
        materials: [],
        activities: [],
        extras: [],
        avaliacoes: []
      };

      const updatedSessions = [...discipline.sessions, newSession];
      
      // Salvar no banco de dados
      await saveSessionsOrder(updatedSessions);
      
      setDiscipline({ ...discipline, sessions: updatedSessions });
      setActiveSession(newSession.id);
      setIsCreateSessionOpen(false);
      setNewSessionType('APRESENTACAO');
    } catch (err) {
      setError('Erro ao criar sessão');
    }
  };

  const updateSessionContent = async (sessionId: string, content: string) => {
    if (!discipline) return;

    const updatedSessions = discipline.sessions.map(session =>
      session.id === sessionId ? { ...session, content } : session
    );

    setDiscipline({ ...discipline, sessions: updatedSessions });
  };

  const moveSession = (sessionId: string, direction: 'up' | 'down') => {
    if (!discipline) return;
    
    const sessions = [...discipline.sessions];
    const currentIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= sessions.length) return;
    
    // Trocar as posições
    [sessions[currentIndex], sessions[newIndex]] = [sessions[newIndex], sessions[currentIndex]];
    
    // Atualizar os números de ordem
    const updatedSessions = sessions.map((session, index) => ({
      ...session,
      order: index + 1
    }));
    
    setDiscipline({ ...discipline, sessions: updatedSessions });
  };

  const saveSessionsOrder = async (sessions: Session[]) => {
    try {
      const response = await fetch(`/api/disciplines/${disciplineId}/sessions-order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessions }),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar ordem das sessões');
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || 'Erro ao salvar ordem');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar ordem das sessões');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!discipline) return;
    
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = discipline.sessions.findIndex(session => session.id === active.id);
      const newIndex = discipline.sessions.findIndex(session => session.id === over.id);
      
      const reorderedSessions = arrayMove(discipline.sessions, oldIndex, newIndex);
      
      // Atualizar os números de ordem
      const updatedSessions = reorderedSessions.map((session, index) => ({
        ...session,
        order: index + 1
      }));
      
      // Salvar no banco de dados
      await saveSessionsOrder(updatedSessions);
      
      setDiscipline({ ...discipline, sessions: updatedSessions });
    }
  };

  const toggleSessionExpanded = (sessionId: string) => {
    setExpandedSessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeSessionData = discipline?.sessions.find(s => s.id === activeSession);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando disciplina...</p>
        </div>
      </div>
    );
  }

  if (error && !discipline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar disciplina</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/professor')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Painel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => router.push('/professor')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            {discipline && getStatusBadge(discipline.status)}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{discipline?.name}</h1>
              <p className="text-gray-600">
                {discipline?.code} • {discipline?.workload}h • {discipline?.course_type}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Progresso Total</div>
              <div className="flex items-center gap-3">
                <Progress value={discipline?.progress || 0} className="w-32 h-2" />
                <span className="text-sm font-medium">{discipline?.progress || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">Alterações salvas com sucesso!</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar com sessões */}
          <div className={`${
            isSidebarOpen ? 'block' : 'hidden'
          } lg:block w-80 flex-shrink-0`}>
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Sessões
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden"
                  >
                    {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {discipline && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={discipline.sessions.map(s => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {discipline.sessions.map((session) => (
                        <SortableSession
                          key={session.id}
                          session={session}
                          isActive={activeSession === session.id}
                          onClick={() => setActiveSession(session.id)}
                          isExpanded={expandedSessions.has(session.id)}
                          onToggleExpand={() => toggleSessionExpanded(session.id)}
                          getSessionIcon={getSessionIcon}
                          getSessionTypeLabel={getSessionTypeLabel}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
                
                {/* Botão discreto de adicionar sessão */}
                <div className="pt-2">
                  <Dialog open={isCreateSessionOpen} onOpenChange={setIsCreateSessionOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full text-gray-400 hover:text-gray-600 border-0 border-dashed border-b-2 hover:border-gray-300 rounded-none h-8"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-300">------</span>
                          <Plus className="w-3 h-3" />
                          <span>Adicionar sessão</span>
                          <span className="text-gray-300">------</span>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Nova Sessão</DialogTitle>
                        <DialogDescription>
                          Escolha o tipo de sessão que deseja criar
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="session-type">Tipo de Sessão</Label>
                          <Select value={newSessionType} onValueChange={(value: any) => setNewSessionType(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="APRESENTACAO">Apresentação</SelectItem>
                              <SelectItem value="ROTEIRO">Roteiro/Temática</SelectItem>
                              <SelectItem value="AVALIACAO">Avaliação</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsCreateSessionOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={createNewSession}>
                            Criar Sessão
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {(!discipline?.sessions || discipline.sessions.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma sessão cadastrada</p>
                    <Dialog open={isCreateSessionOpen} onOpenChange={setIsCreateSessionOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Primeira Sessão
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Criar Nova Sessão</DialogTitle>
                          <DialogDescription>
                            Escolha o tipo de sessão que deseja criar
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="session-type">Tipo de Sessão</Label>
                            <Select value={newSessionType} onValueChange={(value: any) => setNewSessionType(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="APRESENTACAO">Apresentação</SelectItem>
                                <SelectItem value="ROTEIRO">Roteiro/Temática</SelectItem>
                                <SelectItem value="AVALIACAO">Avaliação</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsCreateSessionOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={createNewSession}>
                              Criar Sessão
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1">
            {activeSessionData ? (
              <SessionEditor
                session={activeSessionData}
                onUpdateContent={(content) => updateSessionContent(activeSessionData.id, content)}
                disciplineId={disciplineId}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma sessão</h3>
                  <p className="text-gray-600">Escolha uma sessão na barra lateral para começar a editar.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SessionEditorProps {
  session: Session;
  onUpdateContent: (content: string) => void;
  disciplineId: string;
}

function SessionEditor({ session, onUpdateContent, disciplineId }: SessionEditorProps) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simular salvamento
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  if (session.type === 'APRESENTACAO') {
    return <ApresentacaoEditor session={session} onUpdateContent={onUpdateContent} onSave={handleSave} saving={saving} />;
  } else if (session.type === 'ROTEIRO') {
    return <RoteiroEditor session={session} onUpdateContent={onUpdateContent} onSave={handleSave} saving={saving} />;
  } else if (session.type === 'AVALIACAO') {
    return <AvaliacaoEditor session={session} onUpdateContent={onUpdateContent} onSave={handleSave} saving={saving} />;
  }

  return null;
}

interface SortableSessionProps {
  session: Session;
  isActive: boolean;
  onClick: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  getSessionIcon: (type: string, isCompleted: boolean) => JSX.Element;
  getSessionTypeLabel: (type: string) => string;
}

function SortableSession({ 
  session, 
  isActive, 
  onClick, 
  isExpanded, 
  onToggleExpand, 
  getSessionIcon, 
  getSessionTypeLabel 
}: SortableSessionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: session.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'z-10' : ''}`}
    >
      <div
        className={`w-full rounded-lg border transition-colors cursor-move ${
          isActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        {/* Cabeçalho da sessão */}
        <div 
          className="flex items-center justify-between p-3"
          onClick={onClick}
        >
          <div className="flex items-center gap-2 flex-1">
            {/* Ícone de arrastar */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="w-4 h-4" />
            </div>
            
            {getSessionIcon(session.type, session.is_completed)}
            
            <div className="flex-1">
              <div className="font-medium text-sm">{session.name}</div>
              <div className="text-xs text-gray-500">{getSessionTypeLabel(session.type)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {session.is_completed && (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
            
            {/* Botão de expandir/recolher */}
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Conteúdo expandido */}
        {isExpanded && (
          <div className="px-3 pb-3 pt-0 border-t border-gray-100">
            <div className="text-sm text-gray-600 mt-2">
              <p><strong>Tipo:</strong> {getSessionTypeLabel(session.type)}</p>
              <p><strong>Ordem:</strong> {session.order}</p>
              <p><strong>Status:</strong> {session.is_completed ? 'Concluída' : 'Em andamento'}</p>
              
              {session.content && (
                <div className="mt-2">
                  <p><strong>Conteúdo:</strong></p>
                  <p className="text-gray-500 mt-1">{session.content.substring(0, 100)}...</p>
                </div>
              )}
              
              {session.materials && session.materials.length > 0 && (
                <div className="mt-2">
                  <p><strong>Materiais:</strong> {session.materials.length}</p>
                </div>
              )}
              
              {session.activities && session.activities.length > 0 && (
                <div className="mt-2">
                  <p><strong>Atividades:</strong> {session.activities.length}</p>
                </div>
              )}
              
              {session.avaliacoes && session.avaliacoes.length > 0 && (
                <div className="mt-2">
                  <p><strong>Avaliações:</strong> {session.avaliacoes.length}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ApresentacaoEditorProps {
  session: Session;
  onUpdateContent: (content: string) => void;
  onSave: () => void;
  saving: boolean;
}

function ApresentacaoEditor({ session, onUpdateContent, onSave, saving }: ApresentacaoEditorProps) {
  const [content, setContent] = useState(session.content || '');

  const handleSave = () => {
    onUpdateContent(content);
    onSave();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Apresentação - {session.name}
        </CardTitle>
        <CardDescription>
          Escreva uma mensagem de apresentação para os alunos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="apresentacao">Mensagem de Apresentação</Label>
          <Textarea
            id="apresentacao"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Olá! Sejam bem-vindos à disciplina..."
            className="min-h-[200px] mt-2"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface RoteiroEditorProps {
  session: Session;
  onUpdateContent: (content: string) => void;
  onSave: () => void;
  saving: boolean;
}

function RoteiroEditor({ session, onUpdateContent, onSave, saving }: RoteiroEditorProps) {
  const [orientacao, setOrientacao] = useState(session.content || '');
  const [materiais, setMateriais] = useState(session.materials || []);
  const [atividades, setAtividades] = useState(session.activities || []);
  const [extras, setExtras] = useState(session.extras || []);

  const handleSave = () => {
    onUpdateContent(orientacao);
    onSave();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Roteiro/Temática - {session.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="orientacao">Orientação de Estudo</Label>
            <Textarea
              id="orientacao"
              value={orientacao}
              onChange={(e) => setOrientacao(e.target.value)}
              placeholder="Descreva as orientações de estudo para esta sessão..."
              className="min-h-[150px] mt-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Materiais de Estudo
          </CardTitle>
          <CardDescription>
            Adicione materiais básicos e complementares
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-3">Material Básico</h4>
              <div className="space-y-2">
                {materiais.filter(m => m.type === 'BASICO').map((material) => (
                  <div key={material.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{material.name}</div>
                    {material.description && (
                      <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Material Básico
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Material Complementar</h4>
              <div className="space-y-2">
                {materiais.filter(m => m.type === 'COMPLEMENTAR').map((material) => (
                  <div key={material.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{material.name}</div>
                    {material.description && (
                      <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Material Complementar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Atividades de Estudo
          </CardTitle>
          <CardDescription>
            Adicione atividades para os alunos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Fórum
              </h4>
              <div className="space-y-2">
                {atividades.filter(a => a.type === 'FORUM').map((activity) => (
                  <div key={activity.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{activity.title}</div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Fórum
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Tarefa com Arquivo
              </h4>
              <div className="space-y-2">
                {atividades.filter(a => a.type === 'TAREFA').map((activity) => (
                  <div key={activity.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{activity.title}</div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Tarefa
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FileQuestion className="w-4 h-4" />
                Questionário
              </h4>
              <div className="space-y-2">
                {atividades.filter(a => a.type === 'QUESTIONARIO').map((activity) => (
                  <div key={activity.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{activity.title}</div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Questionário
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Extras
          </CardTitle>
          <CardDescription>
            Adicione conteúdos extras para enriquecer o aprendizado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Para Refletir
              </h4>
              <div className="space-y-2">
                {extras.filter(e => e.type === 'REFLETIR').map((extra) => (
                  <div key={extra.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{extra.title}</div>
                    <p className="text-sm text-gray-600 mt-1">{extra.content}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Reflexão
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Atenção
              </h4>
              <div className="space-y-2">
                {extras.filter(e => e.type === 'ATENCAO').map((extra) => (
                  <div key={extra.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{extra.title}</div>
                    <p className="text-sm text-gray-600 mt-1">{extra.content}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Atenção
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Saiba Mais
              </h4>
              <div className="space-y-2">
                {extras.filter(e => e.type === 'SAIBA_MAIS').map((extra) => (
                  <div key={extra.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{extra.title}</div>
                    <p className="text-sm text-gray-600 mt-1">{extra.content}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Saiba Mais
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
}

interface AvaliacaoEditorProps {
  session: Session;
  onUpdateContent: (content: string) => void;
  onSave: () => void;
  saving: boolean;
}

function AvaliacaoEditor({ session, onUpdateContent, onSave, saving }: AvaliacaoEditorProps) {
  const [avaliacoes, setAvaliacoes] = useState(session.avaliacoes || [
    {
      id: '1',
      tipo: 'DISSERTATIVA',
      titulo: 'Avaliação Dissertativa 1',
      descricao: 'Desenvolva um texto sobre os principais conceitos abordados na disciplina.',
      data: '2024-12-15',
      peso: 40
    },
    {
      id: '2', 
      tipo: 'OBJETIVA',
      titulo: 'Prova Objetiva',
      descricao: 'Prova com 10 questões de múltipla escolha sobre o conteúdo da disciplina.',
      data: '2024-12-20',
      peso: 60
    }
  ]);

  const handleSave = () => {
    onSave();
  };

  const getTipoLabel = (tipo: string) => {
    const labels = {
      'DISSERTATIVA': 'Dissertativa',
      'OBJETIVA': 'Objetiva',
      'PRATICA': 'Prática'
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Avaliações - {session.name}
          </CardTitle>
          <CardDescription>
            Gerencie as avaliações desta sessão
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Lista de Avaliações</h4>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Avaliação
            </Button>
          </div>
          
          <div className="space-y-3">
            {avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium">{avaliacao.titulo}</h5>
                      <Badge variant="outline">{getTipoLabel(avaliacao.tipo)}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{avaliacao.descricao}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Data: {new Date(avaliacao.data).toLocaleDateString('pt-BR')}</span>
                      <span>Peso: {avaliacao.peso}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {avaliacoes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma avaliação cadastrada</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Avaliação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
}