import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Tooltip, Input, Tag, Space, Divider } from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  SaveOutlined, 
  LinkOutlined,
  TagOutlined,
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Document, UpdateDocumentData } from '@/types/document';
import { markdownUtils, linkParser } from '@/utils/document';
import { useDocuments } from '@/hooks/useDocuments';

interface MarkdownEditorProps {
  document: Document;
  onSave?: (data: UpdateDocumentData) => void;
  readOnly?: boolean;
}

export function MarkdownEditor({ document, onSave, readOnly = false }: MarkdownEditorProps) {
  const [content, setContent] = useState(document.content);
  const [title, setTitle] = useState(document.title);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [extractedTags, setExtractedTags] = useState<string[]>([]);
  const [biLinks, setBiLinks] = useState<string[]>([]);
  
  const { updateDocument } = useDocuments();

  // 监听内容变化
  useEffect(() => {
    const hasChanges = content !== document.content || title !== document.title;
    setHasUnsavedChanges(hasChanges);
    
    // 提取标签和双向链接
    const tags = markdownUtils.extractTags(content);
    const links = linkParser.parseLinks(content);
    setExtractedTags(tags);
    setBiLinks(links);
  }, [content, title, document.content, document.title]);

  // 自动保存功能
  useEffect(() => {
    if (!hasUnsavedChanges || readOnly) return;

    const autoSaveTimer = setTimeout(() => {
      handleSave();
    }, 5000); // 5秒后自动保存

    return () => clearTimeout(autoSaveTimer);
  }, [content, title, hasUnsavedChanges]);

  const handleSave = useCallback(async () => {
    if (!hasUnsavedChanges || readOnly) return;

    try {
      setIsSaving(true);
      const updateData: UpdateDocumentData = {
        title,
        content,
        tags: [...document.tags, ...extractedTags].filter((tag, index, arr) => arr.indexOf(tag) === index)
      };

      await updateDocument(document.id, updateData);
      if (onSave) {
        onSave(updateData);
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  }, [content, title, document, extractedTags, hasUnsavedChanges, onSave, updateDocument, readOnly]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S 保存
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    // Ctrl+E 切换预览模式
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      setIsPreviewMode(!isPreviewMode);
    }
  };

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = selectedText || placeholder;
    
    let newContent = content;
    let newCursorPos = start;

    if (syntax === 'link') {
      const linkText = `[${replacement || '链接文字'}](URL)`;
      newContent = content.substring(0, start) + linkText + content.substring(end);
      newCursorPos = start + linkText.length - 4; // 光标定位到URL位置
    } else if (syntax === 'bilink') {
      const biLinkText = `[[${replacement || '双向链接'}]]`;
      newContent = content.substring(0, start) + biLinkText + content.substring(end);
      newCursorPos = start + biLinkText.length;
    } else {
      newContent = content.substring(0, start) + syntax + replacement + syntax + content.substring(end);
      newCursorPos = start + syntax.length + replacement.length + syntax.length;
    }

    setContent(newContent);
    
    // 设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const renderMarkdown = (content: string) => {
    // 处理双向链接
    const processedContent = content.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
      return `<span class="bi-link text-cityu-blue hover:text-primary-700 cursor-pointer font-medium border-b border-dotted border-cityu-blue" data-link="${linkText}">${linkText}</span>`;
    });

    return (
      <ReactMarkdown
        className="prose prose-lg max-w-none"
        components={{
          // 自定义渲染组件
          h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-800 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold text-gray-800 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-700 mb-2">{children}</h3>,
          p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
          code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-cityu-blue">{children}</code>,
          pre: ({ children }) => <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto border">{children}</pre>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-cityu-blue pl-4 italic text-gray-600 my-4">{children}</blockquote>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-gray-700">{children}</li>,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    );
  };

  return (
    <div className="h-full flex flex-col" onKeyDown={handleKeyDown}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          {!readOnly && (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold border-0 shadow-none px-0"
              placeholder="文档标题"
              style={{ width: 'auto', minWidth: '200px' }}
            />
          )}
          {readOnly && (
            <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
          )}
          
          {hasUnsavedChanges && (
            <Tag color="orange" icon={<ClockCircleOutlined />}>
              未保存
            </Tag>
          )}
        </div>

        <Space>
          {/* 文档信息 */}
          <Tooltip title={`字数: ${markdownUtils.calculateReadingTime(content) * 200} | 阅读时间: ${markdownUtils.calculateReadingTime(content)}分钟`}>
            <Button type="text" icon={<FileTextOutlined />} size="small">
              {content.split(' ').length} 字
            </Button>
          </Tooltip>

          {!readOnly && (
            <>
              {/* 格式化按钮 */}
              <Button.Group size="small">
                <Tooltip title="粗体 (Ctrl+B)">
                  <Button onClick={() => insertMarkdown('**', '粗体文字')}>
                    <strong>B</strong>
                  </Button>
                </Tooltip>
                <Tooltip title="斜体 (Ctrl+I)">
                  <Button onClick={() => insertMarkdown('*', '斜体文字')}>
                    <em>I</em>
                  </Button>
                </Tooltip>
                <Tooltip title="插入链接">
                  <Button onClick={() => insertMarkdown('link')} icon={<LinkOutlined />} />
                </Tooltip>
                <Tooltip title="双向链接">
                  <Button onClick={() => insertMarkdown('bilink')} className="text-cityu-blue">
                    [[]]
                  </Button>
                </Tooltip>
              </Button.Group>

              <Divider type="vertical" />

              {/* 预览切换 */}
              <Button.Group size="small">
                <Button 
                  type={!isPreviewMode ? 'primary' : 'default'}
                  onClick={() => setIsPreviewMode(false)}
                  icon={<EditOutlined />}
                >
                  编辑
                </Button>
                <Button 
                  type={isPreviewMode ? 'primary' : 'default'}
                  onClick={() => setIsPreviewMode(true)}
                  icon={<EyeOutlined />}
                >
                  预览
                </Button>
              </Button.Group>

              {/* 保存按钮 */}
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={isSaving}
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className="bg-cityu-blue hover:bg-primary-700"
              >
                {isSaving ? '保存中...' : '保存'}
              </Button>
            </>
          )}
        </Space>
      </div>

      {/* 编辑器主体 */}
      <div className="flex-1 flex">
        {/* 编辑区域 */}
        {(!isPreviewMode || readOnly) && (
          <div className={`${isPreviewMode ? 'hidden' : 'flex-1'} flex flex-col`}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="开始写作..."
              className="flex-1 p-4 border-0 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              readOnly={readOnly}
            />
          </div>
        )}

        {/* 分割线 */}
        {!isPreviewMode && !readOnly && (
          <div className="w-px bg-gray-200"></div>
        )}

        {/* 预览区域 */}
        {(isPreviewMode || readOnly) && (
          <div className={`${!isPreviewMode ? 'flex-1' : 'flex-1'} overflow-y-auto`}>
            <div className="p-4">
              {renderMarkdown(content)}
            </div>
          </div>
        )}
      </div>

      {/* 底部信息栏 */}
      <div className="flex items-center justify-between p-3 border-t bg-gray-50 text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          {/* 提取的标签 */}
          {extractedTags.length > 0 && (
            <div className="flex items-center space-x-2">
              <TagOutlined />
              <span>标签:</span>
              {extractedTags.map(tag => (
                <Tag key={tag} size="small" color="blue">#{tag}</Tag>
              ))}
            </div>
          )}

          {/* 双向链接 */}
          {biLinks.length > 0 && (
            <div className="flex items-center space-x-2">
              <LinkOutlined />
              <span>链接:</span>
              {biLinks.map(link => (
                <Tag key={link} size="small" color="cyan" className="cursor-pointer hover:bg-cityu-blue hover:text-white">
                  {link}
                </Tag>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <span>最后编辑: {new Date(document.updatedAt).toLocaleString('zh-CN')}</span>
          <span>作者: {document.metadata.lastEditedBy}</span>
        </div>
      </div>
    </div>
  );
}