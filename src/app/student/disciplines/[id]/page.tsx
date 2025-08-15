"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, FileText, Video, CheckCircle, Clock, Lock, Unlock } from 'lucide-react';

interface StudyMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'document' | 'link';
  url?: string;
  completed: boolean;
}

interface Activity {
  id: string;
  title: string;
  type: 'quiz' | 'assignment' | 'discussion';
  completed: boolean;
  questions?: number;
}

interface StudyGuide {
  id: string;
  title: string;
  description: string;
  materials: StudyMaterial[];
  activities: Activity[];
  progress: number;
  unlocked: boolean;
}

export default function StudentDisciplinePage({ params }: { params: { id: string } }) {
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据加载
    const mockData: StudyGuide[] = [
      {
        id: '1',
        title: 'Roteiro 1 - Introdução ao CSS',
        description: 'Conceitos básicos de CSS e estilização web',
        unlocked: true,
        progress: 75,
        materials: [
          { id: '1', title: 'Guia CSS Básico', type: 'pdf', completed: true },
          { id: '2', title: 'Video Aula - CSS Fundamentos', type: 'video', completed: true },
          { id: '3', title: 'Exercícios Práticos', type: 'document', completed: false }
        ],
        activities: [
          { id: '1', title: 'Quiz - CSS Básico', type: 'quiz', completed: true, questions: 10 },
          { id: '2', title: 'Atividade Prática', type: 'assignment', completed: false }
        ]
      },
      {
        id: '2',
        title: 'Roteiro 2 - CSS Avançado',
        description: 'Técnicas avançadas de CSS e layout responsivo',
        unlocked: false,
        progress: 0,
        materials: [
          { id: '4', title: 'CSS Grid e Flexbox', type: 'pdf', completed: false },
          { id: '5', title: 'Video - Layout Responsivo', type: 'video', completed: false }
        ],
        activities: [
          { id: '3', title: 'Quiz - CSS Avançado', type: 'quiz', completed: false, questions: 15 },
          { id: '4', title: 'Projeto Final', type: 'assignment', completed: false }
        ]
      }
    ];

    setTimeout(() => {
      setStudyGuides(mockData);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'link': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (completed: boolean) => {
    return completed ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-orange-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando roteiros de estudo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Disciplina: Desenvolvimento Web</h1>
          <p className="text-gray-600">Roteiros de estudo e atividades disponíveis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {studyGuides.map((guide) => (
                <Card key={guide.id} className={`${!guide.unlocked ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {guide.unlocked ? <Unlock className="w-5 h-5 text-green-500" /> : <Lock className="w-5 h-5 text-gray-400" />}
                        <CardTitle className="text-xl">{guide.title}</CardTitle>
                      </div>
                      <Badge variant={guide.unlocked ? "default" : "secondary"}>
                        {guide.unlocked ? "Disponível" : "Bloqueado"}
                      </Badge>
                    </div>
                    <CardDescription>{guide.description}</CardDescription>
                    {guide.unlocked && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span>{guide.progress}%</span>
                        </div>
                        <Progress value={guide.progress} className="h-2" />
                      </div>
                    )}
                  </CardHeader>
                  {guide.unlocked && (
                    <CardContent>
                      <Tabs defaultValue="materials" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="materials">Materiais</TabsTrigger>
                          <TabsTrigger value="activities">Atividades</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="materials" className="space-y-3">
                          {guide.materials.map((material) => (
                            <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                {getIconForType(material.type)}
                                <span className="font-medium">{material.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(material.completed)}
                                <Button size="sm" variant="outline">
                                  Acessar
                                </Button>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="activities" className="space-y-3">
                          {guide.activities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <BookOpen className="w-4 h-4" />
                                <div>
                                  <span className="font-medium">{activity.title}</span>
                                  {activity.questions && (
                                    <p className="text-sm text-gray-500">{activity.questions} questões</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(activity.completed)}
                                <Button size="sm" variant={activity.completed ? "outline" : "default"}>
                                  {activity.completed ? "Revisar" : "Iniciar"}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas da Disciplina</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(studyGuides.reduce((acc, guide) => acc + guide.progress, 0) / studyGuides.length)}%
                  </div>
                  <p className="text-sm text-gray-600">Progresso Geral</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Roteiros Completos</span>
                    <span className="text-sm font-medium">
                      {studyGuides.filter(g => g.progress === 100).length}/{studyGuides.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Materiais Estudados</span>
                    <span className="text-sm font-medium">
                      {studyGuides.reduce((acc, guide) => acc + guide.materials.filter(m => m.completed).length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Atividades Concluídas</span>
                    <span className="text-sm font-medium">
                      {studyGuides.reduce((acc, guide) => acc + guide.activities.filter(a => a.completed).length, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}