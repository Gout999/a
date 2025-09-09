import React from 'react';
import { Layout, Row, Col } from 'antd';
import { ChatSidebar } from '@/components/ui/chat-sidebar';
import { ChatInterface } from '@/components/ui/chat-interface';

const { Content } = Layout;

export function AIAssistantPage() {
  return (
    <Layout className="h-full bg-gray-50">
      <Content className="p-6 h-full">
        <Row gutter={16} className="h-full">
          {/* 左侧会话列表 */}
          <Col xs={24} md={8} lg={6} className="h-full mb-4 md:mb-0">
            <ChatSidebar className="h-full" />
          </Col>
          
          {/* 右侧聊天界面 */}
          <Col xs={24} md={16} lg={18} className="h-full">
            <ChatInterface className="h-full" />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}