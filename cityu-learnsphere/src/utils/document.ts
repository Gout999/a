import { Document, CreateDocumentData, UpdateDocumentData, BiDirectionalLink } from '@/types/document';

// 模拟文档API
export const documentAPI = {
  async getDocuments(): Promise<Document[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        title: '机器学习基础笔记',
        content: `# 机器学习基础

## 什么是机器学习？

机器学习是人工智能的一个分支，它使计算机能够在没有明确编程的情况下学习。

### 主要类型

1. **监督学习** - 使用标记数据进行训练
2. **无监督学习** - 从未标记数据中发现模式
3. **强化学习** - 通过与环境交互学习

## 相关链接

- [[深度学习概述]]
- [[数据预处理技巧]]
- [[CityU AI课程]]

## 参考资料

- 《机器学习》- 周志华
- Stanford CS229 课程`,
        tags: ['机器学习', 'AI', '笔记'],
        category: '学习笔记',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        authorId: '1',
        isPublic: false,
        collaborators: [],
        backlinks: ['2', '3'],
        metadata: {
          wordCount: 156,
          readingTime: 2,
          lastEditedBy: '张小明'
        }
      },
      {
        id: '2',
        title: '深度学习概述',
        content: `# 深度学习概述

深度学习是[[机器学习基础笔记]]的一个重要分支，使用多层神经网络来学习数据的表示。

## 核心概念

### 神经网络
- 感知机
- 多层感知机
- 卷积神经网络 (CNN)
- 循环神经网络 (RNN)

### 训练过程
1. 前向传播
2. 损失计算
3. 反向传播
4. 参数更新

## 应用领域

- 计算机视觉
- 自然语言处理
- 语音识别
- 推荐系统

参考：[[机器学习基础笔记]]`,
        tags: ['深度学习', 'AI', '神经网络'],
        category: '学习笔记',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
        authorId: '1',
        isPublic: false,
        collaborators: [],
        backlinks: ['1'],
        metadata: {
          wordCount: 98,
          readingTime: 1,
          lastEditedBy: '张小明'
        }
      },
      {
        id: '3',
        title: 'CityU AI课程规划',
        content: `# CityU AI课程规划

## 本学期课程

### CS4487 - 机器学习
- 教授：Dr. Li
- 时间：周二、周四 14:30-16:00
- 地点：AC1 4/F Lecture Theatre
- 相关笔记：[[机器学习基础笔记]]

### CS5487 - 深度学习
- 教授：Dr. Wang  
- 时间：周一、周三 16:00-17:30
- 地点：Yeung Building LT-7

## 学习计划

1. **第1-4周**：基础理论学习
2. **第5-8周**：实践项目开发
3. **第9-12周**：高级主题研究
4. **第13-16周**：期末项目完成

## 推荐资源

- CityU图书馆AI书籍推荐
- Coursera在线课程
- GitHub开源项目

## 香港AI发展

香港作为国际金融中心，在AI应用方面有独特优势：
- 金融科技创新
- 智慧城市建设
- 跨境数据流通`,
        tags: ['课程规划', 'CityU', 'AI', '学习计划'],
        category: '学术规划',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        authorId: '1',
        isPublic: true,
        collaborators: ['2', '3'],
        backlinks: ['1'],
        metadata: {
          wordCount: 187,
          readingTime: 2,
          lastEditedBy: '张小明'
        }
      }
    ];
  },

  async getDocument(id: string): Promise<Document> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const documents = await this.getDocuments();
    const document = documents.find(doc => doc.id === id);
    if (!document) {
      throw new Error('文档未找到');
    }
    return document;
  },

  async createDocument(data: CreateDocumentData): Promise<Document> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newDocument: Document = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content || '',
      tags: data.tags || [],
      category: data.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: '1',
      isPublic: false,
      collaborators: [],
      backlinks: [],
      metadata: {
        wordCount: (data.content || '').split(' ').length,
        readingTime: Math.ceil((data.content || '').split(' ').length / 200),
        lastEditedBy: '张小明'
      }
    };
    
    return newDocument;
  },

  async updateDocument(id: string, data: UpdateDocumentData): Promise<Document> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const document = await this.getDocument(id);
    const updatedDocument: Document = {
      ...document,
      ...data,
      updatedAt: new Date().toISOString(),
      metadata: {
        ...document.metadata,
        wordCount: (data.content || document.content).split(' ').length,
        readingTime: Math.ceil((data.content || document.content).split(' ').length / 200),
        lastEditedBy: '张小明'
      }
    };
    
    return updatedDocument;
  },

  async deleteDocument(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    // 模拟删除操作
  },

  async searchDocuments(query: string): Promise<Document[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const documents = await this.getDocuments();
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.content.toLowerCase().includes(query.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
};

// 双向链接解析工具
export const linkParser = {
  // 解析文档中的双向链接 [[链接文本]]
  parseLinks(content: string): string[] {
    const linkRegex = /\[\[([^\]]+)\]\]/g;
    const links: string[] = [];
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      links.push(match[1]);
    }
    
    return links;
  },

  // 将双向链接转换为可点击的链接
  renderLinks(content: string, onLinkClick: (linkText: string) => void): string {
    return content.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
      return `<span class="bi-link" data-link="${linkText}">${linkText}</span>`;
    });
  },

  // 查找反向链接
  findBacklinks(targetTitle: string, documents: Document[]): BiDirectionalLink[] {
    const backlinks: BiDirectionalLink[] = [];
    
    documents.forEach(doc => {
      const links = this.parseLinks(doc.content);
      links.forEach(linkText => {
        if (linkText === targetTitle) {
          backlinks.push({
            sourceId: doc.id,
            targetId: '', // 需要根据标题查找目标文档ID
            sourceText: linkText,
            targetTitle: targetTitle,
            linkType: 'reference'
          });
        }
      });
    });
    
    return backlinks;
  }
};

// Markdown工具函数
export const markdownUtils = {
  // 计算阅读时间（基于平均阅读速度200字/分钟）
  calculateReadingTime(content: string): number {
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  },

  // 提取文档摘要
  extractSummary(content: string, maxLength: number = 150): string {
    // 移除Markdown语法
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // 移除标题
      .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体
      .replace(/\*(.*?)\*/g, '$1') // 移除斜体
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接
      .replace(/\[\[([^\]]+)\]\]/g, '$1') // 移除双向链接
      .replace(/```[\s\S]*?```/g, '') // 移除代码块
      .replace(/`([^`]+)`/g, '$1') // 移除行内代码
      .trim();
    
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  },

  // 提取标签
  extractTags(content: string): string[] {
    const tagRegex = /#([a-zA-Z0-9\u4e00-\u9fa5]+)/g;
    const tags: string[] = [];
    let match;
    
    while ((match = tagRegex.exec(content)) !== null) {
      if (!tags.includes(match[1])) {
        tags.push(match[1]);
      }
    }
    
    return tags;
  },

  // 生成目录
  generateTOC(content: string): Array<{level: number, title: string, anchor: string}> {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const toc: Array<{level: number, title: string, anchor: string}> = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const anchor = title.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
      
      toc.push({ level, title, anchor });
    }
    
    return toc;
  }
};