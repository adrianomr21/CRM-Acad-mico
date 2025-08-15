"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  BookOpen, 
  FileText, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users
} from 'lucide-react';

interface Discipline {
  id: string;
  name: string;
  code: string;
  workload: number;
  course_type: string;
  status: string;
  course_id: string;
  created_by: string;
  has_ead_hours: boolean;
  has_practical_hours: boolean;
  has_integrated_project: boolean;
  has_presential_exam: boolean;
  is_licenciatura: boolean;
  has_complementary_eval: boolean;
  has_extension_curriculum: boolean;
  needs_presential_tool: boolean;
  delivery_date: string | null;
  last_access: string | null;
  course: {
    id: string;
    name: string;
    type: string;
  };
  sessions: Session[];
  materials: Material[];
  activities: Activity[];
  evaluations: Evaluation[];
}

interface Session {
  id: string;
  name: string;
  type: 'APRESENTACAO' | 'ROTEIRO' | 'AVALIACAO';
  order: number;
  is_completed: boolean;
}

interface Material {
  id: string;
  name: string;
  type: 'BASICO' | 'COMPLEMENTAR';
  description: string;
  file_url: string | null;
  link_url: string | null;
  is_authorial: boolean;
  used_ai: boolean;
  ai_tool: string | null;
  ai_usage: string | null;
}

interface Activity {
  id: string;
  type: 'QUESTIONARIO' | 'TAREFA' | 'FORUM';
  title: string;
  guidance: string;
  order: number;
}

interface Evaluation {
  id: string;
  type: 'DISSERTATIVA' | 'OBJETIVA';
  guidance: string;
  file_url: string | null;
}

export default function EditDisciplinePage() {
  const params = useParams();
  const router = useRouter();
  const disciplineId = params.id as string;
  
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    workload: 0,
    course_type: 'GRADUACAO',
    has_ead_hours: false,
    has_practical_hours: false,
    has_integrated_project: false,
    has_presential_exam: false,
    is_licenciatura: false,
    has_complementary_eval: false,
    has_extension_curriculum: false,
    needs_presential_tool: false,
    delivery_date: ''
  });

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
        setDiscipline(data.data);
        setFormData({
          name: data.data.name,
          code: data.data.code,
          workload: data.data.workload,
          course_type: data.data.course_type,
          has_ead_hours: data.data.has_ead_hours,
          has_practical_hours: data.data.has_practical_hours,
          has_integrated_project: data.data.has_integrated_project,
          has_presential_exam: data.data.has_presential_exam,
          is_licenciatura: data.data.is_licenciatura,
          has_complementary_eval: data.data.has_complementary_eval,
          has_extension_curriculum: data.data.has_extension_curriculum,
          needs_presential_tool: data.data.needs_presential_tool,
          delivery_date: data.data.delivery_date ? data.data.delivery_date.split('T')[0] : ''
        });
      } else {
        throw new Error(data.message || 'Erro ao carregar disciplina');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/disciplines/${disciplineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar disciplina');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setSuccess(true);
        // Atualizar os dados locais
        loadDiscipline();
      } else {
        throw new Error(data.message || 'Erro ao atualizar disciplina');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      CRIADA: { variant: 'secondary' as const, text: 'Criada', icon: Clock },
      ATRIBUIDA: { variant: 'default' as const, text: 'Atribuída', icon: Users },
      EM_PROGRESSO: { variant: 'default' as const, text: 'Em Progresso', icon: BookOpen },
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

  if (!disciplineId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ID da disciplina não fornecido</h3>
          <Button onClick={() => router.push('/professor')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Painel
          </Button>
        </div>
      </div>
    );
  }

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
            Voltar para o Painel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push('/professor')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Disciplina</h1>
                <p className="text-gray-600">
                  {discipline?.name} - {discipline?.code}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {discipline && getStatusBadge(discipline.status)}
            </div>
          </div>
        </div>

        {success && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Disciplina atualizada com sucesso!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="structure">Estrutura</TabsTrigger>
              <TabsTrigger value="sessions">Sessões</TabsTrigger>
              <TabsTrigger value="materials">Materiais</TabsTrigger>
              <TabsTrigger value="activities">Atividades</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>
                    Dados fundamentais da disciplina
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da Disciplina</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="code">Código</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => handleInputChange('code', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="workload">Carga Horária</Label>
                      <Input
                        id="workload"
                        type="number"
                        value={formData.workload}
                        onChange={(e) => handleInputChange('workload', parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="course_type">Tipo de Curso</Label>
                      <Select value={formData.course_type} onValueChange={(value) => handleInputChange('course_type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GRADUACAO">Graduação</SelectItem>
                          <SelectItem value="POS_GRADUACAO">Pós-graduação</SelectItem>
                          <SelectItem value="EXTENSAO">Extensão</SelectItem>
                          <SelectItem value="EAD">EAD</SelectItem>
                          <SelectItem value="INSTITUCIONAL">Institucional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="delivery_date">Data de Entrega</Label>
                      <Input
                        id="delivery_date"
                        type="date"
                        value={formData.delivery_date}
                        onChange={(e) => handleInputChange('delivery_date', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="structure">
              <Card>
                <CardHeader>
                  <CardTitle>Estrutura da Disciplina</CardTitle>
                  <CardDescription>
                    Configurações específicas da disciplina
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Formato</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="has_ead_hours"
                            checked={formData.has_ead_hours}
                            onChange={(e) => handleInputChange('has_ead_hours', e.target.checked)}
                          />
                          <Label htmlFor="has_ead_hours">Possui horas EAD</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="has_practical_hours"
                            checked={formData.has_practical_hours}
                            onChange={(e) => handleInputChange('has_practical_hours', e.target.checked)}
                          />
                          <Label htmlFor="has_practical_hours">Possui horas práticas</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is_licenciatura"
                            checked={formData.is_licenciatura}
                            onChange={(e) => handleInputChange('is_licenciatura', e.target.checked)}
                          />
                          <Label htmlFor="is_licenciatura">É licenciatura</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Avaliações</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="has_presential_exam"
                            checked={formData.has_presential_exam}
                            onChange={(e) => handleInputChange('has_presential_exam', e.target.checked)}
                          />
                          <Label htmlFor="has_presential_exam">Possui prova presencial</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="has_complementary_eval"
                            checked={formData.has_complementary_eval}
                            onChange={(e) => handleInputChange('has_complementary_eval', e.target.checked)}
                          />
                          <Label htmlFor="has_complementary_eval">Possui avaliação complementar</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Requisitos</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="has_integrated_project"
                            checked={formData.has_integrated_project}
                            onChange={(e) => handleInputChange('has_integrated_project', e.target.checked)}
                          />
                          <Label htmlFor="has_integrated_project">Possui projeto integrado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="has_extension_curriculum"
                            checked={formData.has_extension_curriculum}
                            onChange={(e) => handleInputChange('has_extension_curriculum', e.target.checked)}
                          />
                          <Label htmlFor="has_extension_curriculum">Possui currículo extensionista</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="needs_presential_tool"
                            checked={formData.needs_presential_tool}
                            onChange={(e) => handleInputChange('needs_presential_tool', e.target.checked)}
                          />
                          <Label htmlFor="needs_presential_tool">Necessita ferramenta presencial</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle>Sessões de Estudo</CardTitle>
                  <CardDescription>
                    Gerencie as sessões de estudo da disciplina
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Sessões cadastradas: {discipline?.sessions?.length || 0}
                      </p>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Sessão
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {discipline?.sessions?.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              session.type === 'APRESENTACAO' ? 'bg-blue-100 text-blue-600' :
                              session.type === 'ROTEIRO' ? 'bg-green-100 text-green-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                              {session.type === 'APRESENTACAO' ? <Users className="w-4 h-4" /> :
                               session.type === 'ROTEIRO' ? <BookOpen className="w-4 h-4" /> :
                               <FileText className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-medium">{session.name}</p>
                              <p className="text-sm text-gray-600">
                                {session.type} • Ordem: {session.order}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.is_completed && (
                              <Badge variant="default">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Concluída
                              </Badge>
                            )}
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {(!discipline?.sessions || discipline.sessions.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Nenhuma sessão cadastrada</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials">
              <Card>
                <CardHeader>
                  <CardTitle>Materiais de Apoio</CardTitle>
                  <CardDescription>
                    Gerencie os materiais de apoio para as sessões
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Materiais cadastrados: {discipline?.materials?.length || 0}
                      </p>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Material
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {discipline?.materials?.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              material.type === 'BASICO' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                            }`}>
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium">{material.name}</p>
                              <p className="text-sm text-gray-600">
                                {material.type} • {material.is_authorial ? 'Autoral' : 'Não autoral'}
                              </p>
                              {material.description && (
                                <p className="text-sm text-gray-500">{material.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {(!discipline?.materials || discipline.materials.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Nenhum material cadastrado</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities">
              <Card>
                <CardHeader>
                  <CardTitle>Atividades e Avaliações</CardTitle>
                  <CardDescription>
                    Gerencie as atividades e avaliações da disciplina
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="activities" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="activities">Atividades</TabsTrigger>
                      <TabsTrigger value="evaluations">Avaliações</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="activities" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            Atividades cadastradas: {discipline?.activities?.length || 0}
                          </p>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Atividade
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {discipline?.activities?.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${
                                  activity.type === 'QUESTIONARIO' ? 'bg-blue-100 text-blue-600' :
                                  activity.type === 'TAREFA' ? 'bg-green-100 text-green-600' :
                                  'bg-purple-100 text-purple-600'
                                }`}>
                                  <Activity className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-medium">{activity.title}</p>
                                  <p className="text-sm text-gray-600">
                                    {activity.type} • Ordem: {activity.order}
                                  </p>
                                  <p className="text-sm text-gray-500">{activity.guidance}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  Editar
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          
                          {(!discipline?.activities || discipline.activities.length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p>Nenhuma atividade cadastrada</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="evaluations" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            Avaliações cadastradas: {discipline?.evaluations?.length || 0}
                          </p>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Avaliação
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {discipline?.evaluations?.map((evaluation) => (
                            <div key={evaluation.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${
                                  evaluation.type === 'DISSERTATIVA' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                }`}>
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-medium">Avaliação {evaluation.type}</p>
                                  <p className="text-sm text-gray-600">{evaluation.type}</p>
                                  <p className="text-sm text-gray-500">{evaluation.guidance}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  Editar
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          
                          {(!discipline?.evaluations || discipline.evaluations.length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p>Nenhuma avaliação cadastrada</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={() => router.push('/professor')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}