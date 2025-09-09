import React, { useState } from 'react';
import { 
  Card, 
  List, 
  Button, 
  Input, 
  Typography, 
  Space, 
  Dropdown, 
  Modal,
  Select,
  Switch,
  Divider,
  Tooltip,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  MessageOutlined, 
  MoreOutlined,
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
  SearchOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { ChatSession, ChatPreferences } from '@/types/ai';
import { useAI } from '@/hooks/useAI';

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface ChatSidebarProps {
  className?: string;
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const { 
    sessions, 
    currentSession, 
    preferences,
    isLoading,
    createSession, 
    deleteSession, 
    setCurrentSession,
    updatePreferences
  } = useAI();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [newSessionTitle, setNewSessionTitle] = useState('');

  // 过滤会话
  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 创建新会话
  const handleCreateSession = async () => {
    try {
      await createSession();
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  // 删除会话
  const handleDeleteSession = async (sessionId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个对话吗？此操作无法撤销。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteSession(sessionId);
        } catch (error) {
          console.error('Failed to delete session:', error);
        }
      },
    });
  };

  // 编辑会话标题
  const handleEditSession = (sessionId: string, currentTitle: string) => {
    setEditingSession(sessionId);
    setNewSessionTitle(currentTitle);
  };

  // 保存会话标题
  const handleSaveSessionTitle = () => {
    // 这里应该调用API更新会话标题
    setEditingSession(null);
    setNewSessionTitle('');
  };

  // 会话操作菜单
  const getSessionActions = (session: ChatSession) => [
    {
      key: 'edit',
      label: '重命名',
      icon: <EditOutlined />,
      onClick: () => handleEditSession(session.id, session.title),
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteSession(session.id),
    },
  ];

  // 渲染会话项
  const renderSessionItem = (session: ChatSession) => {
    const isActive = currentSession?.id === session.id;
    const messageCount = session.messages.length;
    const lastMessage = session.messages[session.messages.length - 1];
    const lastMessageTime = lastMessage 
      ? new Date(lastMessage.timestamp).toLocaleString('zh-CN', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : '';

    return (
      <List.Item
        key={session.id}
        className={`cursor-pointer transition-all duration-200 rounded-lg mb-2 ${
          isActive 
            ? 'bg-cityu-blue bg-opacity-10 border-l-4 border-cityu-blue' 
            : 'hover:bg-gray-50'
        }`}
        onClick={() => setCurrentSession(session)}
      >
        <div className="w-full px-3 py-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {editingSession === session.id ? (
                <Input
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  onPressEnter={handleSaveSessionTitle}
                  onBlur={handleSaveSessionTitle}
                  className="mb-1"
                  autoFocus
                />
              ) : (
                <Text 
                  className={`font-medium block truncate ${
                    isActive ? 'text-cityu-blue' : 'text-gray-900'
                  }`}
                >
                  {session.title}
                </Text>
              )}
              
              <div className="flex items-center justify-between mt-1">
                <Space size={4}>
                  <Badge 
                    count={messageCount} 
                    size="small" 
                    className="text-xs"
                    style={{ backgroundColor: '#52c41a' }}
                  />
                  <Text className="text-xs text-gray-500">
                    {lastMessageTime}
                  </Text>
                </Space>
              </div>
              
              {lastMessage && (
                <Text className="text-xs text-gray-400 block truncate mt-1">
                  {lastMessage.role === 'user' ? '我: ' : 'AI: '}
                  {lastMessage.content.substring(0, 30)}
                  {lastMessage.content.length > 30 ? '...' : ''}
                </Text>
              )}
            </div>
            
            <Dropdown
              menu={{ items: getSessionActions(session) }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </div>
        </div>
      </List.Item>
    );
  };

  return (
    <Card 
      className={`h-full ${className}`}
      bodyStyle={{ padding: 0, height: '100%' }}
    >
      <div className="h-full flex flex-col">
        {/* 头部 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Title level={5} className="m-0 flex items-center">
              <RobotOutlined className="mr-2 text-cityu-blue" />
              AI 助手
            </Title>
            <Space>
              <Tooltip title="设置">
                <Button
                  type="text"
                  size="small"
                  icon={<SettingOutlined />}
                  onClick={() => setShowSettings(true)}
                />
              </Tooltip>
              <Tooltip title="新对话">
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={handleCreateSession}
                  loading={isLoading}
                  className="bg-cityu-blue hover:bg-blue-600 border-cityu-blue"
                />
              </Tooltip>
            </Space>
          </div>
          
          <Search
            placeholder="搜索对话..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            allowClear
          />
        </div>

        {/* 会话列表 */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageOutlined className="text-4xl text-gray-300 mb-2" />
              <Text className="text-gray-500 block">
                {searchTerm ? '没有找到匹配的对话' : '还没有对话记录'}
              </Text>
              {!searchTerm && (
                <Button
                  type="link"
                  onClick={handleCreateSession}
                  className="mt-2 text-cityu-blue"
                >
                  开始新对话
                </Button>
              )}
            </div>
          ) : (
            <List
              dataSource={filteredSessions}
              renderItem={renderSessionItem}
              className="session-list"
            />
          )}
        </div>
      </div>

      {/* 设置模态框 */}
      <Modal
        title="AI 助手设置"
        open={showSettings}
        onCancel={() => setShowSettings(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowSettings(false)}>
            取消
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            onClick={() => setShowSettings(false)}
            className="bg-cityu-blue hover:bg-blue-600 border-cityu-blue"
          >
            保存
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div>
            <Text className="block mb-2 font-medium">语言偏好</Text>
            <Select
              value={preferences.language}
              onChange={(value) => updatePreferences({ language: value })}
              className="w-full"
            >
              <Option value="zh">中文</Option>
              <Option value="en">English</Option>
              <Option value="auto">自动检测</Option>
            </Select>
          </div>

          <div>
            <Text className="block mb-2 font-medium">回复风格</Text>
            <Select
              value={preferences.responseStyle}
              onChange={(value) => updatePreferences({ responseStyle: value })}
              className="w-full"
            >
              <Option value="academic">学术风格</Option>
              <Option value="casual">轻松风格</Option>
              <Option value="professional">专业风格</Option>
              <Option value="creative">创意风格</Option>
            </Select>
          </div>

          <div>
            <Text className="block mb-2 font-medium">学科领域</Text>
            <Select
              value={preferences.subject}
              onChange={(value) => updatePreferences({ subject: value })}
              className="w-full"
            >
              <Option value="通用学习">通用学习</Option>
              <Option value="计算机科学">计算机科学</Option>
              <Option value="数据科学">数据科学</Option>
              <Option value="商业管理">商业管理</Option>
              <Option value="工程技术">工程技术</Option>
              <Option value="人文社科">人文社科</Option>
              <Option value="艺术设计">艺术设计</Option>
            </Select>
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <Text className="font-medium">包含参考资料</Text>
            <Switch
              checked={preferences.includeReferences}
              onChange={(checked) => updatePreferences({ includeReferences: checked })}
            />
          </div>

          <div>
            <Text className="block mb-2 font-medium">回复长度</Text>
            <Select
              value={preferences.maxTokens}
              onChange={(value) => updatePreferences({ maxTokens: value })}
              className="w-full"
            >
              <Option value={500}>简短 (~500字)</Option>
              <Option value={1000}>中等 (~1000字)</Option>
              <Option value={2000}>详细 (~2000字)</Option>
              <Option value={4000}>完整 (~4000字)</Option>
            </Select>
          </div>
        </div>
      </Modal>
    </Card>
  );
}