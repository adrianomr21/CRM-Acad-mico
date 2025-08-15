"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Table,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  FileText,
  Eye,
  Download
} from 'lucide-react';

interface RichTextEditorProps {
  title?: string;
  initialContent?: string;
  onSave?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function RichTextEditor({
  title = "Editor de Texto",
  initialContent = "",
  onSave,
  placeholder = "Comece a digitar seu conteúdo aqui...",
  readOnly = false
}: RichTextEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateCounts = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(text.length);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    updateCounts(newContent);
  };

  const handleFormatText = (format: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    let newCursorPosition = end;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        newCursorPosition = end + 4;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        newCursorPosition = end + 2;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        newCursorPosition = end + 7;
        break;
      case 'heading1':
        formattedText = `# ${selectedText}`;
        newCursorPosition = end + 2;
        break;
      case 'heading2':
        formattedText = `## ${selectedText}`;
        newCursorPosition = end + 3;
        break;
      case 'heading3':
        formattedText = `### ${selectedText}`;
        newCursorPosition = end + 4;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        newCursorPosition = end + 3;
        break;
      case 'orderedList':
        formattedText = `\n1. ${selectedText}`;
        newCursorPosition = end + 4;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        newCursorPosition = end + 3;
        break;
      case 'code':
        formattedText = `\`\`\`${selectedText}\`\`\``;
        newCursorPosition = end + 6;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        newCursorPosition = end + 6;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    handleContentChange(newContent);
    
    // Restaurar o foco e a posição do cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderPreview = () => {
    // Simple markdown to HTML conversion for preview
    let html = content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/<u>(.*)<\/u>/gim, '<u>$1</u>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^1\. (.*$)/gim, '<li>$1</li>')
      .replace(/\`\`\`(.*$)\`\`\`/gims, '<pre><code>$1</code></pre>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n/gim, '<br>');

    return { __html: html };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {wordCount} palavras
            </Badge>
            <Badge variant="outline" className="text-xs">
              {charCount} caracteres
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? 'Editar' : 'Visualizar'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!readOnly && !isPreviewMode && (
          <div className="border-b pb-3 mb-4">
            <div className="flex flex-wrap gap-1">
              {/* Formatação de texto */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFormatText('bold')}
                title="Negrito"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFormatText('italic')}
                title="Itálico"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFormatText('underline')}
                title="Sublinhado"
              >
                <Underline className="w-4 h-4" />
              </Button>
              
              <div className="w-px h-6 bg-gray-300 mx-1" />
              
              {/* Cabeçalhos */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFormatText('heading1')}
                title="Título 1"
              >
                <Heading1 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFormatText('heading2')}
                title="Título 2"
              >
                <Heading2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFormatText('heading3')}
                title="Título 3"
              >
                <Heading3 className="w-4 h-4" />
              </Button>
              
              <div className="w-px h-6 bg-gray-300 mx-1" />
              
              {/* Listas */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFormatText('list')}
                title="Lista não ordenada"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFormatText('orderedList')}
                title="Lista ordenada"
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              
              <div className="w-px h-6 bg-gray-300 mx-1" />
              
              {/* Outros */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFormatText('quote')}
                title="Citação"
              >
                <Quote className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFormatText('code')}
                title="Código"
              >
                <Code className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFormatText('link')}
                title="Link"
              >
                <Link className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {isPreviewMode ? (
          <div className="prose max-w-none">
            <div 
              className="min-h-[400px] p-4 border rounded-md bg-gray-50"
              dangerouslySetInnerHTML={renderPreview()}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={placeholder}
              className="w-full min-h-[400px] p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly={readOnly}
            />
          </div>
        )}

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div className="text-sm text-gray-500">
            {readOnly ? "Modo de apenas leitura" : "Editor com suporte a Markdown"}
          </div>
          <div className="flex gap-2">
            {!readOnly && (
              <>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}