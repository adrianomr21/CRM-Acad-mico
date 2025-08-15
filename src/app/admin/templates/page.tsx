"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Save, 
  Edit, 
  Trash2, 
  Settings, 
  FileText, 
  BookOpen,
  Users,
  CheckCircle,
  AlertCircle,
  Copy
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  sessionName: string;
  numberingType: 'numbers' | 'letters' | 'roman';
  minAuthorMaterials: number;
  minStudyActivities: number;
  minEvaluations: number;
  isActive: boolean;
  disciplines: string[];
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sessionName: 'Roteiro',
    numberingType: 'numbers' as 'numbers' | 'letters' | 'roman',
    minAuthorMaterials: 3,
    minStudyActivities: 2,
    minEvaluations: 1,
    isActive: true
  });

  useEffect(() => {
    // Simular carregamento de dados
    const mockData: Template[] = [
      {
        id: '1',
        name: 'Template Padrão Graduação',
        sessionName: 'Roteiro',
        numberingType: 'numbers',
        minAuthorMaterials: 3,
        minStudyActivities: 2,
        minEvaluations: 1,
        isActive: true,
        disciplines: ['Programação Web', 'Banco de Dados']
      },
      {
        id: '2',
        name: 'Template Pós-Graduação',
        sessionName: 'Temática',
        numberingType: 'letters',
        minAuthorMaterials: 5,
        minStudyActivities: 3,
        minEvaluations: 2,
        isActive: true,
        disciplines: ['Inteligência Artificial']
      },
      {
        id: '3',
        name: 'Template EAD',
        sessionName: 'Unidade',
        numberingType: 'roman',
        minAuthorMaterials: 4,
        minStudyActivities: 4,
        minEvaluations: 1,
        isActive: false,
        disciplines: []
      }
    ];

    setTimeout(() => {
      setTemplates(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getNumberingTypeText = (type: string) => {
    const types = {
      numbers: 'Números (1, 2, 3...)',
      letters: 'Letras (A, B, C...)',
      roman: 'Romanos (I, II, III...)'
    };
    return types[type as keyof typeof types] || type;
  };

  const getNumberingTypeIcon = (type: string) => {
    return type === 'numbers' ? '123' : type === 'letters' ? 'ABC' : 'I II III';
  };

  const handleCreateTemplate = () => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      ...formData,
      disciplines: []
    };
    setTemplates([...templates, newTemplate]);
    resetForm();
    setIsCreating(false);
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return;
    
    const updatedTemplates = templates.map(template =>
      template.id === editingTemplate.id
        ? { ...template, ...formData }
        : template
    );
    setTemplates(updatedTemplates);
    resetForm();
    setEditingTemplate(null);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      sessionName: template.sessionName,
      numberingType: template.numberingType,
      minAuthorMaterials: template.minAuthorMaterials,
      minStudyActivities: template.minStudyActivities,
      minEvaluations: template.minEvaluations,
      isActive: template.isActive
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(template => template.id !== templateId));
  };

  const handleDuplicateTemplate = (template: Template) => {
    const duplicatedTemplate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Cópia)`,
      disciplines: []
    };
    setTemplates([...templates, duplicatedTemplate]);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sessionName: 'Roteiro',
      numberingType: 'numbers',
      minAuthorMaterials: 3,
      minStudyActivities: 2,
      minEvaluations: 1,
      isActive: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Templates de Disciplina</h1>
          <p className="text-gray-600">Configure os templates padrão para criação de disciplinas</p>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Templates</TabsTrigger>
            <TabsTrigger value="create">
              {isCreating || editingTemplate ? 'Editar Template' : 'Novo Template'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {templates.length} templates cadastrados
              </div>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Template
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant={template.isActive ? 'default' : 'secondary'}>
                          {template.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Nome da sessão: <span className="font-medium">{template.sessionName}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Numeração:</span>
                          <span className="font-medium">{getNumberingTypeText(template.numberingType)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Materiais mínimos:</span>
                          <span className="font-medium">{template.minAuthorMaterials}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Atividades mínimas:</span>
                          <span className="font-medium">{template.minStudyActivities}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Avaliações mínimas:</span>
                          <span className="font-medium">{template.minEvaluations}</span>
                        </div>
                      </div>
                    </div>

                    {template.disciplines.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Usado em:</div>
                        <div className="flex flex-wrap gap-1">
                          {template.disciplines.map((discipline, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {discipline}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button variant="outline" className="w-full" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar Requisitos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {templates.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
                  <p className="text-gray-600 mb-4">Crie seu primeiro template para padronizar a criação de disciplinas.</p>
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Template
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isCreating ? 'Novo Template' : 'Editar Template'}
                </CardTitle>
                <CardDescription>
                  Configure os requisitos mínimos para este template de disciplina
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome do Template</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Ex: Template Padrão Graduação"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sessionName">Nome da Sessão</Label>
                      <Input
                        id="sessionName"
                        value={formData.sessionName}
                        onChange={(e) => setFormData({...formData, sessionName: e.target.value})}
                        placeholder="Ex: Roteiro, Temática, Unidade"
                      />
                    </div>

                    <div>
                      <Label htmlFor="numberingType">Tipo de Numeração</Label>
                      <Select 
                        value={formData.numberingType} 
                        onValueChange={(value: 'numbers' | 'letters' | 'roman') => 
                          setFormData({...formData, numberingType: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="numbers">Números (1, 2, 3...)</SelectItem>
                          <SelectItem value="letters">Letras (A, B, C...)</SelectItem>
                          <SelectItem value="roman">Romanos (I, II, III...)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="minAuthorMaterials">Materiais Autorais Mínimos</Label>
                      <Input
                        id="minAuthorMaterials"
                        type="number"
                        min="0"
                        value={formData.minAuthorMaterials}
                        onChange={(e) => setFormData({...formData, minAuthorMaterials: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="minStudyActivities">Atividades de Estudo Mínimas</Label>
                      <Input
                        id="minStudyActivities"
                        type="number"
                        min="0"
                        value={formData.minStudyActivities}
                        onChange={(e) => setFormData({...formData, minStudyActivities: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="minEvaluations">Avaliações Mínimas</Label>
                      <Input
                        id="minEvaluations"
                        type="number"
                        min="0"
                        value={formData.minEvaluations}
                        onChange={(e) => setFormData({...formData, minEvaluations: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Template ativo</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={isCreating ? handleCreateTemplate : handleUpdateTemplate}
                    disabled={!formData.name}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isCreating ? 'Criar Template' : 'Salvar Alterações'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingTemplate(null);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}