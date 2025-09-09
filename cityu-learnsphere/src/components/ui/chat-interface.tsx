import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Avatar, 
  Typography, 
  Space, 
  Divider,
  Tag,
  Tooltip,
  Spin,
  Alert
} from 'antd';
import { 
  SendOutlined, 
  RobotOutlined, 
  UserOutlined,
  CopyOutlined,
  LikeOutlined,
  DislikeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, SendMessageRequest } from '@/types/ai';
import { useAI } from '@/hooks/useAI';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

interface ChatInterfaceProps {
  className?: string;
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const { 
    currentSession, 
    isTyping, 
    error, 
    sendMessage, 
    clearError,
    preferences 
  } = useAI();
  
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, isTyping]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSubmitting) return;

    const content = inputValue.trim();
    setInputValue('');
    setIsSubmitting(true);

    try {
      const request: SendMessageRequest = {
        content,
        sessionId: currentSession?.id,
        preferences
      };
      
      await sendMessage(request);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
      inputRef.current?.focus();
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 复制消息内容
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // 重新生成回复
  const handleRegenerateResponse = async (messageIndex: number) => {
    if (!currentSession || messageIndex < 1) return;
    
    const userMessage = currentSession.messages[messageIndex - 1];
    if (userMessage.role !== 'user') return;

    try {
      const request: SendMessageRequest = {
        content: userMessage.content,
        sessionId: currentSession.id,
        preferences,
        regenerate: true
      };
      
      await sendMessage(request);
    } catch (error) {
      console.error('Failed to regenerate response:', error);
    }
  };

  // 渲染消息项
  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.role === 'user';
    const isAI = message.role === 'assistant';

    return (
      <div
        key={message.id}
        className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* 头像 */}
        <Avatar
          size={40}
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          className={`flex-shrink-0 ${
            isUser 
              ? 'bg-cityu-blue text-white' 
              : 'bg-gradient-to-br from-cityu-orange to-orange-400 text-white'
          }`}
        />

        {/* 消息内容 */}
        <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
          {/* 消息气泡 */}
          <div
            className={`inline-block p-4 rounded-2xl shadow-sm ${
              isUser
                ? 'bg-cityu-blue text-white rounded-br-md'
                : 'bg-white border border-gray-200 rounded-bl-md'
            }`}
          >
            {isUser ? (
              <Text className="text-white whitespace-pre-wrap">
                {message.content}
              </Text>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* 消息时间和操作 */}
          <div className={`mt-2 flex items-center gap-2 text-xs text-gray-500 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}>
            <span>{new Date(message.timestamp).toLocaleTimeString('zh-CN')}</span>
            
            {isAI && (
              <Space size={4}>
                <Tooltip title="复制内容">
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => handleCopyMessage(message.content)}
                    className="text-gray-400 hover:text-gray-600"
                  />
                </Tooltip>
                <Tooltip title="重新生成">
                  <Button
                    type="text"
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={() => handleRegenerateResponse(index)}
                    className="text-gray-400 hover:text-gray-600"
                  />
                </Tooltip>
                <Tooltip title="有用">
                  <Button
                    type="text"
                    size="small"
                    icon={<LikeOutlined />}
                    className="text-gray-400 hover:text-green-500"
                  />
                </Tooltip>
                <Tooltip title="无用">
                  <Button
                    type="text"
                    size="small"
                    icon={<DislikeOutlined />}
                    className="text-gray-400 hover:text-red-500"
                  />
                </Tooltip>
              </Space>
            )}
          </div>

          {/* AI消息的额外信息 */}
          {isAI && message.metadata && (
            <div className="mt-2">
              {message.metadata.suggestions && message.metadata.suggestions.length > 0 && (
                <div className="mb-2">
                  <Text className="text-xs text-gray-500 mb-1 block">相关建议：</Text>
                  <Space wrap>
                    {message.metadata.suggestions.map((suggestion, idx) => (
                      <Tag
                        key={idx}
                        className="cursor-pointer hover:bg-cityu-blue hover:text-white transition-colors"
                        onClick={() => setInputValue(suggestion)}
                      >
                        {suggestion}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}
              
              {message.metadata.references && message.metadata.references.length > 0 && (
                <div>
                  <Text className="text-xs text-gray-500 mb-1 block">参考资料：</Text>
                  <div className="space-y-1">
                    {message.metadata.references.map((ref, idx) => (
                      <div key={idx} className="text-xs">
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cityu-blue hover:underline"
                        >
                          {ref.title}
                        </a>
                        {ref.description && (
                          <Text className="text-gray-500 ml-2">- {ref.description}</Text>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={`h-full flex flex-col ${className}`} bodyStyle={{ padding: 0, height: '100%' }}>
      {/* 错误提示 */}
      {error && (
        <Alert
          message="发生错误"
          description={error}
          type="error"
          closable
          onClose={clearError}
          className="m-4 mb-0"
        />
      )}

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {!currentSession ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <RobotOutlined className="text-6xl text-gray-300 mb-4" />
              <Text className="text-gray-500 text-lg block mb-2">
                欢迎使用 CityU LearnSphere AI 助手
              </Text>
              <Text className="text-gray-400">
                开始新对话，我将为您提供个性化的学习支持
              </Text>
            </div>
          </div>
        ) : (
          <>
            {currentSession.messages.map((message, index) => 
              renderMessage(message, index)
            )}
            
            {/* AI正在输入指示器 */}
            {isTyping && (
              <div className="flex gap-3 mb-6">
                <Avatar
                  size={40}
                  icon={<RobotOutlined />}
                  className="flex-shrink-0 bg-gradient-to-br from-cityu-orange to-orange-400 text-white"
                />
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 shadow-sm">
                  <Spin size="small" />
                  <Text className="ml-2 text-gray-500">AI正在思考中...</Text>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <Divider className="m-0" />

      {/* 输入区域 */}
      <div className="p-4">
        <div className="flex gap-2">
          <TextArea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题，按 Enter 发送，Shift+Enter 换行..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={isSubmitting}
            disabled={!inputValue.trim() || isSubmitting}
            className="bg-cityu-blue hover:bg-blue-600 border-cityu-blue hover:border-blue-600"
          >
            发送
          </Button>
        </div>
        
        {/* 输入提示 */}
        <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
          <span>
            当前模式: {preferences.responseStyle === 'academic' ? '学术模式' : '通用模式'} | 
            学科: {preferences.subject}
          </span>
          <span>{inputValue.length}/2000</span>
        </div>
      </div>
    </Card>
  );
}