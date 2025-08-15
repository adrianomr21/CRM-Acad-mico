"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Download,
  Eye
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  url?: string;
}

interface FileUploadProps {
  title?: string;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onFileUpload?: (files: FileItem[]) => void;
  onFileRemove?: (fileId: string) => void;
  initialFiles?: FileItem[];
  readOnly?: boolean;
}

export default function FileUpload({
  title = "Upload de Arquivos",
  acceptedTypes = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mp3",
  maxSize = 10,
  multiple = true,
  onFileUpload,
  onFileRemove,
  initialFiles = [],
  readOnly = false
}: FileUploadProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File) => {
    // Validar tipo
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: `Tipo de arquivo não permitido. Tipos aceitos: ${acceptedTypes}`
      };
    }

    // Validar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      return {
        valid: false,
        error: `Arquivo muito grande. Tamanho máximo: ${maxSize}MB`
      };
    }

    return { valid: true };
  };

  const handleFileSelect = (selectedFiles: FileList) => {
    Array.from(selectedFiles).forEach(file => {
      const validation = validateFile(file);
      
      if (!validation.valid) {
        // Adicionar arquivo com erro
        const errorFile: FileItem = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error',
          progress: 0
        };
        setFiles(prev => [...prev, errorFile]);
        return;
      }

      // Adicionar arquivo para upload
      const newFile: FileItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      };

      setFiles(prev => [...prev, newFile]);

      // Simular upload
      simulateUpload(newFile.id, file);
    });
  };

  const simulateUpload = (fileId: string, file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'completed', progress: 100, url: URL.createObjectURL(file) }
            : f
        ));
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: Math.min(progress, 99) }
            : f
        ));
      }
    }, 500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (readOnly) return;
    
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (onFileRemove) {
      onFileRemove(fileId);
    }
  };

  const handleDownload = (file: FileItem) => {
    if (file.url) {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const completedFiles = files.filter(f => f.status === 'completed');
  const uploadingFiles = files.filter(f => f.status === 'uploading');
  const errorFiles = files.filter(f => f.status === 'error');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!readOnly && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Arraste arquivos para aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Tipos aceitos: {acceptedTypes} (máx. {maxSize}MB)
            </p>
            <Button variant="outline">
              Selecionar Arquivos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              accept={acceptedTypes}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        )}

        {/* Status dos uploads */}
        {(uploadingFiles.length > 0 || errorFiles.length > 0) && (
          <div className="space-y-3">
            {uploadingFiles.length > 0 && (
              <div className="text-sm text-blue-600">
                {uploadingFiles.length} arquivo(s) fazendo upload...
              </div>
            )}
            {errorFiles.length > 0 && (
              <div className="text-sm text-red-600">
                {errorFiles.length} arquivo(s) com erro
              </div>
            )}
          </div>
        )}

        {/* Lista de arquivos */}
        <div className="space-y-2">
          {files.map((file) => {
            const Icon = getFileIcon(file.type);
            
            return (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <Icon className="w-8 h-8 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{file.name}</span>
                      <Badge variant={
                        file.status === 'completed' ? 'default' :
                        file.status === 'uploading' ? 'secondary' : 'destructive'
                      } className="text-xs">
                        {file.status === 'completed' ? 'Concluído' :
                         file.status === 'uploading' ? 'Enviando' : 'Erro'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </div>
                    {file.status === 'uploading' && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.round(file.progress)}%
                        </div>
                      </div>
                    )}
                    {file.status === 'error' && (
                      <div className="text-xs text-red-600 mt-1">
                        Erro no upload
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {file.status === 'completed' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file)}
                        title="Baixar"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.url, '_blank')}
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(file.id)}
                      title="Remover"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumo */}
        {files.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total de arquivos: {files.length}</span>
              <span>
                Concluídos: {completedFiles.length} | 
                Enviando: {uploadingFiles.length} | 
                Erros: {errorFiles.length}
              </span>
            </div>
          </div>
        )}

        {files.length === 0 && !readOnly && (
          <div className="text-center py-8 text-gray-500">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum arquivo selecionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}