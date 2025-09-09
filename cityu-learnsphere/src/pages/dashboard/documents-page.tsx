import React, { useState } from 'react';
import { Layout, Modal, Form, Input, Select, Button, message } from 'antd';
import { DocumentList } from '@/components/ui/document-list';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { Document, CreateDocumentData } from '@/types/document';
import { useDocuments } from '@/hooks/useDocuments';

const { Sider, Content } = Layout;
const { Option } = Select;

export function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const { createDocument } = useDocuments();

  const categories = [
    '学习笔记',
    '学术规划',
    '研究项目',
    '课程作业',
    '文献综述',
    '会议记录',
    '个人思考',
    '其他'
  ];

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleCreateDocument = () => {
    setCreateModalVisible(true);
  };

  const handleCreateSubmit = async (values: CreateDocumentData) => {
    try {
      const newDocument = await createDocument(values);
      setSelectedDocument(newDocument);
      setCreateModalVisible(false);
      createForm.resetFields();
      message.success('文档创建成功');
    } catch (error) {
      message.error('创建失败');
    }
  };

  const handleCreateCancel = () => {
    setCreateModalVisible(false);
    createForm.resetFields();
  };

  return (
    <Layout className="h-screen bg-gray-50">
      {/* 左侧文档列表 */}
      <Sider 
        width={400} 
        className="bg-white border-r border-gray-200"
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        <DocumentList
          onDocumentSelect={handleDocumentSelect}
          onCreateDocument={handleCreateDocument}
        />
      </Sider>

      {/* 右侧编辑器 */}
      <Content className="flex flex-col">
        {selectedDocument ? (
          <MarkdownEditor
            key={selectedDocument.id}
            document={selectedDocument}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg 
                  className="w-12 h-12 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                选择一个文档开始编辑
              </h3>
              <p className="text-gray-500 mb-6">
                从左侧列表中选择文档，或创建新文档开始您的知识管理之旅
              </p>
              <Button 
                type="primary" 
                size="large"
                onClick={handleCreateDocument}
                className="bg-cityu-blue hover:bg-primary-700"
              >
                创建新文档
              </Button>
            </div>
          </div>
        )}
      </Content>

      {/* 创建文档对话框 */}
      <Modal
        title="创建新文档"
        open={createModalVisible}
        onOk={() => createForm.submit()}
        onCancel={handleCreateCancel}
        okText="创建"
        cancelText="取消"
        width={500}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="title"
            label="文档标题"
            rules={[
              { required: true, message: '请输入文档标题' },
              { min: 1, max: 100, message: '标题长度应在1-100字符之间' }
            ]}
          >
            <Input 
              placeholder="请输入文档标题"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="文档分类"
            rules={[{ required: true, message: '请选择文档分类' }]}
          >
            <Select 
              placeholder="请选择文档分类"
              size="large"
            >
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
            help="多个标签请用逗号分隔"
          >
            <Input 
              placeholder="例如: 机器学习, AI, 笔记"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="初始内容"
          >
            <Input.TextArea
              placeholder="可选：输入文档的初始内容"
              rows={4}
              showCount
              maxLength={1000}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}