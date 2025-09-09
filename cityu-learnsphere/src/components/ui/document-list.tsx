import React, { useState } from 'react';
import { 
  List, 
  Card, 
  Tag, 
  Button, 
  Input, 
  Select, 
  Space, 
  Typography, 
  Avatar, 
  Tooltip,
  Dropdown,
  Modal,
  message
} from 'antd';
import { 
  FileTextOutlined, 
  SearchOutlined, 
  PlusOutlined, 
  FilterOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  TagOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Document } from '@/types/document';
import { useDocuments } from '@/hooks/useDocuments';
import { markdownUtils } from '@/utils/document';

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface DocumentListProps {
  onDocumentSelect: (document: Document) => void;
  onCreateDocument: () => void;
}

export function DocumentList({ onDocumentSelect, onCreateDocument }: DocumentListProps) {
  const { 
    documents, 
    searchResults, 
    isLoading, 
    searchDocuments, 
    deleteDocument 
  } = useDocuments();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // 获取要显示的文档列表
  const displayDocuments = searchQuery ? searchResults : documents;

  // 过滤和排序文档
  const filteredAndSortedDocuments = displayDocuments
    .filter(doc => filterCategory === 'all' || doc.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // 获取所有分类
  const categories = Array.from(new Set(documents.map(doc => doc.category)));

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      searchDocuments(value);
    }
  };

  const handleDeleteClick = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentToDelete(document);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;
    
    try {
      await deleteDocument(documentToDelete.id);
      message.success('文档删除成功');
      setDeleteModalVisible(false);
      setDocumentToDelete(null);
    } catch (error) {
      message.error('删除失败');
    }
  };

  const getDocumentMenuItems = (document: Document) => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
      onClick: () => onDocumentSelect(document),
    },
    {
      key: 'share',
      icon: <ShareAltOutlined />,
      label: '分享',
      onClick: () => message.info('分享功能开发中'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      danger: true,
      onClick: (e: any) => handleDeleteClick(document, e.domEvent),
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 头部工具栏 */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <Title level={4} className="mb-0">
            我的文档
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateDocument}
            className="bg-cityu-blue hover:bg-primary-700"
          >
            新建文档
          </Button>
        </div>

        {/* 搜索和筛选 */}
        <Space direction="vertical" className="w-full">
          <Search
            placeholder="搜索文档标题、内容或标签..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="w-full"
          />
          
          <div className="flex items-center space-x-3">
            <Select
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: 120 }}
              size="small"
            >
              <Option value="all">全部分类</Option>
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>

            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 120 }}
              size="small"
            >
              <Option value="updated">最近更新</Option>
              <Option value="created">创建时间</Option>
              <Option value="title">标题排序</Option>
            </Select>

            <Text className="text-gray-500 text-sm">
              共 {filteredAndSortedDocuments.length} 个文档
            </Text>
          </div>
        </Space>
      </div>

      {/* 文档列表 */}
      <div className="flex-1 overflow-y-auto">
        <List
          loading={isLoading}
          dataSource={filteredAndSortedDocuments}
          renderItem={(document) => (
            <List.Item
              className="hover:bg-gray-50 cursor-pointer transition-colors px-4 py-3 border-0"
              onClick={() => onDocumentSelect(document)}
            >
              <div className="w-full">
                <Card
                  size="small"
                  className="border-0 shadow-none hover:shadow-sm transition-shadow"
                  bodyStyle={{ padding: '12px 0' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* 文档标题和图标 */}
                      <div className="flex items-center mb-2">
                        <FileTextOutlined className="text-cityu-blue mr-2 flex-shrink-0" />
                        <Title 
                          level={5} 
                          className="mb-0 truncate text-gray-800 hover:text-cityu-blue"
                          style={{ fontSize: '16px' }}
                        >
                          {document.title}
                        </Title>
                      </div>

                      {/* 文档摘要 */}
                      <Text 
                        className="text-gray-600 text-sm block mb-3 leading-relaxed"
                        style={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {markdownUtils.extractSummary(document.content, 120)}
                      </Text>

                      {/* 标签 */}
                      {document.tags.length > 0 && (
                        <div className="mb-3">
                          <Space size={[4, 4]} wrap>
                            {document.tags.slice(0, 3).map(tag => (
                              <Tag 
                                key={tag} 
                                size="small" 
                                color="blue"
                                icon={<TagOutlined />}
                              >
                                {tag}
                              </Tag>
                            ))}
                            {document.tags.length > 3 && (
                              <Tag size="small" color="default">
                                +{document.tags.length - 3}
                              </Tag>
                            )}
                          </Space>
                        </div>
                      )}

                      {/* 文档信息 */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <ClockCircleOutlined className="mr-1" />
                            {formatDate(document.updatedAt)}
                          </span>
                          <span className="flex items-center">
                            <UserOutlined className="mr-1" />
                            {document.metadata.lastEditedBy}
                          </span>
                          <span>
                            {document.metadata.wordCount} 字
                          </span>
                          <span>
                            {document.metadata.readingTime} 分钟阅读
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Tag 
                            size="small" 
                            color={document.isPublic ? 'green' : 'default'}
                          >
                            {document.isPublic ? '公开' : '私有'}
                          </Tag>
                          <Tag size="small" color="cyan">
                            {document.category}
                          </Tag>
                        </div>
                      </div>
                    </div>

                    {/* 操作菜单 */}
                    <div className="ml-4 flex-shrink-0">
                      <Dropdown
                        menu={{ items: getDocumentMenuItems(document) }}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          size="small"
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Dropdown>
                    </div>
                  </div>
                </Card>
              </div>
            </List.Item>
          )}
          locale={{
            emptyText: searchQuery ? '未找到相关文档' : '暂无文档，点击新建文档开始创作'
          }}
        />
      </div>

      {/* 删除确认对话框 */}
      <Modal
        title="删除文档"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setDocumentToDelete(null);
        }}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>
          确定要删除文档 <strong>"{documentToDelete?.title}"</strong> 吗？
        </p>
        <p className="text-gray-500 text-sm">
          此操作不可撤销，文档删除后将无法恢复。
        </p>
      </Modal>
    </div>
  );
}