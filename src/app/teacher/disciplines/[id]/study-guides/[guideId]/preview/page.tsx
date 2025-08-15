"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, FileText, Video, CheckCircle, Clock, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';

interface StudyMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'document' | 'link';
  url?: string;
}

interface Activity {
  id: string;
  title: string;
  type: 'quiz' | 'assignment' | 'discussion';
  questions?: number;
}

interface StudyGuide {
  id: string;
  title: string;
  description: string;
  materials: StudyMaterial[];
  activities: Activity[];
}

export default function TeacherPreviewPage({ params }: { params: { id: string; guideId: string } }) {
  const [studyGuide, setStudyGuide] = useState<StudyGuide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据加载
    const mockData: StudyGuide = {
      id: params.guideId,
      title: 'Roteiro 2 - CSS e Estilização',
      description: 'Conceitos avançados de CSS e técnicas de estilização para desenvolvimento web moderno',
      materials: [
        { id: '1', title: 'Guia Completo de CSS', type: 'pdf' },
        { id: '2', title: 'Video Aula - Flexbox e Grid', type: 'video' },
        { id: '3', title: 'Exercícios Práticos CSS', type: 'document' },
        { id: '4', title: 'Referência CSS MDN', type: 'link' }
      ],
      activities: [
        { id: '1', title: 'Quiz - CSS Avançado', type: 'quiz', questions: 15 },
        { id: '2', title: 'Projeto - Layout Responsivo', type: 'assignment' },
        { id: '3', title: 'Discussão - Melhores Práticas', type: 'discussion' }
      ]
    };

    setTimeout(() => {
      setStudyGuide(mockData);
      setLoading(false);
    }, 1000);
  }, [params.id, params.guideId]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'link': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando preview...</p>
        </div>
      </div>
    );
  }

  if (!studyGuide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Roteiro não encontrado</h2>
          <Link href={`/teacher/disciplines/${params.id}`}>
            <Button>Voltar</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/teacher/disciplines/${params.id}`}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Edição
            </Button>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Modo de Preview</h1>
          </div>
          <p className="text-gray-600">Esta é a visão que os alunos terão deste roteiro de estudo</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{studyGuide.title}</CardTitle>
                  <CardDescription className="text-base">{studyGuide.description}</CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">
                  Preview
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="materials" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="materials">Materiais de Estudo</TabsTrigger>
              <TabsTrigger value="activities">Atividades</TabsTrigger>
            </TabsList>
            
            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Materiais Disponíveis</CardTitle>
                  <CardDescription>
                    Recursos de aprendizagem para este roteiro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studyGuide.materials.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          {getIconForType(material.type)}
                          <div>
                            <span className="font-medium">{material.title}</span>
                            <p className="text-sm text-gray-500 capitalize">{material.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <Button size="sm" variant="outline">
                            Acessar Material
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Atividades Propostas</CardTitle>
                  <CardDescription>
                    Atividades para avaliação e prática
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studyGuide.activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4" />
                          <div>
                            <span className="font-medium">{activity.title}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs capitalize">
                                {activity.type}
                              </Badge>
                              {activity.questions && (
                                <span className="text-xs text-gray-500">
                                  {activity.questions} questões
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <Button size="sm" variant="default">
                            Iniciar Atividade
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Progresso do Aluno (Simulado)</CardTitle>
              <CardDescription>
                Como os alunos verão seu progresso neste roteiro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Materiais Concluídos</span>
                  <span>0/{studyGuide.materials.length}</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Atividades Concluídas</span>
                  <span>0/{studyGuide.activities.length}</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Progresso Total</span>
                  <span>0%</span>
                </div>
                <Progress value={0} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}