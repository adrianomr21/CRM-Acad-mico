"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Users, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Wifi, 
  GraduationCap,
  UserCheck,
  FileText,
  BarChart3
} from 'lucide-react';

export default function Home() {
  const [systemStatus, setSystemStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [databaseStatus, setDatabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [websocketStatus, setWebsocketStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    checkSystemHealth();
    checkDatabaseConnection();
    checkWebSocketConnection();
  }, []);

  const checkSystemHealth = async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        setSystemStatus('online');
      } else {
        setSystemStatus('offline');
      }
    } catch (error) {
      setSystemStatus('offline');
    }
  };

  const checkDatabaseConnection = async () => {
    setDatabaseStatus('checking');
    try {
      const response = await fetch('/api/test-supabase');
      if (response.ok) {
        setDatabaseStatus('connected');
      } else {
        setDatabaseStatus('error');
      }
    } catch (error) {
      setDatabaseStatus('error');
    }
  };

  const checkWebSocketConnection = () => {
    setWebsocketStatus('checking');
    try {
      const socket = new WebSocket('ws://localhost:3000/api/socketio');
      
      socket.onopen = () => {
        setWebsocketStatus('connected');
        socket.close();
      };
      
      socket.onerror = () => {
        setWebsocketStatus('disconnected');
      };
      
      socket.onmessage = (event) => {
        console.log('WebSocket message:', event.data);
      };
      
      setTimeout(() => {
        if (websocketStatus === 'checking') {
          setWebsocketStatus('disconnected');
          if (socket.readyState === WebSocket.OPEN) {
            socket.close();
          }
        }
      }, 3000);
    } catch (error) {
      setWebsocketStatus('disconnected');
    }
  };

  const StatusBadge = ({ status }: { status: 'checking' | 'online' | 'offline' | 'connected' | 'error' | 'disconnected' }) => {
    const variants = {
      checking: { variant: 'secondary' as const, text: 'Verificando...', icon: AlertCircle },
      online: { variant: 'default' as const, text: 'Online', icon: CheckCircle },
      offline: { variant: 'destructive' as const, text: 'Offline', icon: AlertCircle },
      connected: { variant: 'default' as const, text: 'Conectado', icon: CheckCircle },
      error: { variant: 'destructive' as const, text: 'Erro', icon: AlertCircle },
      disconnected: { variant: 'destructive' as const, text: 'Desconectado', icon: AlertCircle },
    };

    const { variant, text, icon: Icon } = variants[status];
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {text}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-24 h-24 md:w-32 md:h-32 mb-6">
            <img
              src="/logo.svg"
              alt="Z.ai Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CRM Acadêmico
          </h1>
          <p className="text-lg text-muted-foreground text-center">
            Sistema de Gestão de Criação de Disciplinas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Status do Sistema
              </CardTitle>
              <CardDescription>
                Verificação do estado geral do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Servidor:</span>
                  <StatusBadge status={systemStatus} />
                </div>
                <div className="flex justify-between items-center">
                  <span>Banco de Dados:</span>
                  <StatusBadge status={databaseStatus} />
                </div>
                <div className="flex justify-between items-center">
                  <span>WebSocket:</span>
                  <StatusBadge status={websocketStatus} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Acesso ao Sistema
              </CardTitle>
              <CardDescription>
                Portais para administradores e professores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin">
                <Button className="w-full justify-start" variant="outline">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Painel Administrativo
                </Button>
              </Link>
              <Link href="/professor">
                <Button className="w-full justify-start" variant="outline">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Painel do Professor
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Sistema
              </CardTitle>
              <CardDescription>
                Informações e configurações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={checkSystemHealth}>
                <Wifi className="w-4 h-4 mr-2" />
                Verificar Conexão
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={checkDatabaseConnection}>
                <Wifi className="w-4 h-4 mr-2" />
                Testar Banco de Dados
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={checkWebSocketConnection}>
                <Wifi className="w-4 h-4 mr-2" />
                Testar WebSocket
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Funcionalidades Administrativas
              </CardTitle>
              <CardDescription>
                Gestão completa de disciplinas e templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Criação e configuração de disciplinas</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Templates padrão personalizáveis</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Acompanhamento de progresso</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Relatórios e exportação de dados</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Funcionalidades para Professores
              </CardTitle>
              <CardDescription>
                Preenchimento de conteúdo e atividades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Dashboard de disciplinas atribuídas</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Editor de texto completo</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Gestão de materiais e atividades</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Sistema de notificações</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Sistema CRM Acadêmico iniciado com sucesso! Administradores podem criar disciplinas e atribuí-las aos professores. 
            Professores podem acessar suas disciplinas e preencher o conteúdo seguindo os templates configurados.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}