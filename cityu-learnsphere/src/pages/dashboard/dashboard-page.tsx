import React from 'react';
import { Layout, Card, Typography, Button, Row, Col, Avatar, Progress, List } from 'antd';
import { 
  BookOutlined, 
  RobotOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    { 
      icon: <BookOutlined />, 
      title: '文档管理', 
      color: '#0066CC',
      onClick: () => navigate('/documents')
    },
    { 
      icon: <RobotOutlined />, 
      title: 'AI助手', 
      color: '#FF6B35',
      onClick: () => navigate('/ai-assistant')
    },
    { 
      icon: <TeamOutlined />, 
      title: '协作空间', 
      color: '#52c41a',
      onClick: () => console.log('协作空间功能开发中')
    },
    { 
      icon: <CalendarOutlined />, 
      title: '时间管理', 
      color: '#722ed1',
      onClick: () => console.log('时间管理功能开发中')
    },
  ];

  const recentDocuments = [
    { title: '机器学习笔记', time: '2小时前', type: 'markdown' },
    { title: '项目计划书', time: '昨天', type: 'document' },
    { title: '文献综述', time: '3天前', type: 'research' },
  ];

  const todayTasks = [
    { task: '完成数据结构作业', priority: 'high', completed: false },
    { task: '阅读AI论文', priority: 'medium', completed: true },
    { task: '参加学术讲座', priority: 'low', completed: false },
  ];

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-cityu rounded-lg flex items-center justify-center mr-4">
            <span className="text-white font-bold text-lg">CU</span>
          </div>
          <Title level={4} className="mb-0 text-gray-800">
            CityU LearnSphere
          </Title>
        </div>
        
        <div className="flex items-center gap-4">
          <Button type="text" icon={<BellOutlined />} />
          <Button type="text" icon={<SettingOutlined />} />
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar} size="large">
              {user?.fullName?.charAt(0)}
            </Avatar>
            <div className="hidden md:block">
              <Text strong className="block text-gray-800">{user?.fullName}</Text>
              <Text className="text-gray-500 text-sm">{user?.department}</Text>
            </div>
          </div>
          <Button 
            type="text" 
            icon={<LogoutOutlined />} 
            onClick={logout}
            className="text-gray-600 hover:text-red-500"
          />
        </div>
      </Header>

      <Content className="p-6">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            欢迎回来，{user?.fullName} 👋
          </Title>
          <Text className="text-gray-600 text-lg">
            今天是美好的一天，让我们开始学习之旅吧！
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* 左侧主要内容 */}
          <Col xs={24} lg={16}>
            {/* 快速操作 */}
            <Card className="mb-6 shadow-cityu">
              <Title level={4} className="mb-4">快速操作</Title>
              <Row gutter={[16, 16]}>
                {quickActions.map((action, index) => (
                  <Col xs={12} sm={6} key={index}>
                    <Card 
                      hoverable 
                      className="text-center card-hover border-0 cursor-pointer"
                      bodyStyle={{ padding: '1.5rem 1rem' }}
                      onClick={action.onClick}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                        style={{ backgroundColor: `${action.color}15`, color: action.color }}
                      >
                        {React.cloneElement(action.icon, { style: { fontSize: '1.5rem' } })}
                      </div>
                      <Text strong className="text-gray-700">{action.title}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* 最近文档 */}
            <Card className="shadow-cityu">
              <div className="flex justify-between items-center mb-4">
                <Title level={4} className="mb-0">最近文档</Title>
                <Button type="link" className="text-cityu-blue">
                  查看全部
                </Button>
              </div>
              <List
                dataSource={recentDocuments}
                renderItem={(item) => (
                  <List.Item className="hover:bg-gray-50 px-4 py-3 rounded-lg cursor-pointer">
                    <List.Item.Meta
                      avatar={<BookOutlined className="text-cityu-blue text-lg" />}
                      title={<Text strong className="text-gray-800">{item.title}</Text>}
                      description={<Text className="text-gray-500">{item.time}</Text>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* 右侧边栏 */}
          <Col xs={24} lg={8}>
            {/* 学习进度 */}
            <Card className="mb-6 shadow-cityu">
              <Title level={4} className="mb-4">本周学习进度</Title>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>文档阅读</Text>
                    <Text strong>75%</Text>
                  </div>
                  <Progress percent={75} strokeColor="#0066CC" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>AI对话</Text>
                    <Text strong>60%</Text>
                  </div>
                  <Progress percent={60} strokeColor="#FF6B35" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Text>协作项目</Text>
                    <Text strong>40%</Text>
                  </div>
                  <Progress percent={40} strokeColor="#52c41a" />
                </div>
              </div>
            </Card>

            {/* 今日任务 */}
            <Card className="shadow-cityu">
              <div className="flex justify-between items-center mb-4">
                <Title level={4} className="mb-0">今日任务</Title>
                <Button 
                  type="text" 
                  icon={<PlusOutlined />} 
                  className="text-cityu-blue"
                />
              </div>
              <List
                dataSource={todayTasks}
                renderItem={(item) => (
                  <List.Item className="px-0">
                    <div className="flex items-center w-full">
                      <input 
                        type="checkbox" 
                        checked={item.completed}
                        className="mr-3 w-4 h-4 text-cityu-blue rounded"
                      />
                      <div className="flex-1">
                        <Text 
                          className={item.completed ? 'line-through text-gray-400' : 'text-gray-700'}
                        >
                          {item.task}
                        </Text>
                        <div className="mt-1">
                          <span 
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              item.priority === 'high' ? 'bg-red-100 text-red-600' :
                              item.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}
                          >
                            {item.priority === 'high' ? '高优先级' : 
                             item.priority === 'medium' ? '中优先级' : '低优先级'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}