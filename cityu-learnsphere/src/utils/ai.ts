import { ChatMessage, AIResponse, SendMessageRequest, ChatSession, QuickPrompt } from '@/types/ai';

// 模拟deepseek API调用
export const aiAPI = {
  async sendMessage(request: SendMessageRequest): Promise<AIResponse> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const { content, context } = request;
    
    // 模拟AI响应生成
    const responses = generateAIResponse(content, context);
    
    return {
      content: responses.content,
      tokens: Math.floor(responses.content.length / 4), // 粗略估算token数
      model: 'deepseek-chat',
      suggestions: responses.suggestions,
      references: responses.references
    };
  },

  async createSession(title: string, userId: string): Promise<ChatSession> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
      context: {
        subject: '通用学习',
        documents: [],
        preferences: {
          language: 'zh',
          responseStyle: 'academic',
          subject: '通用学习',
          includeReferences: true,
          maxTokens: 2000
        }
      }
    };
  },

  async getSessions(userId: string): Promise<ChatSession[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟历史会话数据
    return [
      {
        id: '1',
        title: '机器学习基础问答',
        messages: [
          {
            id: '1',
            role: 'user',
            content: '什么是机器学习？',
            timestamp: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '2',
            role: 'assistant',
            content: '机器学习是人工智能的一个分支，它使计算机能够在没有明确编程的情况下学习和改进。通过算法和统计模型，机器学习系统可以从数据中识别模式并做出预测或决策。',
            timestamp: new Date(Date.now() - 86400000 + 5000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 + 5000).toISOString(),
        userId,
        context: {
          subject: '机器学习',
          documents: ['1'],
          preferences: {
            language: 'zh',
            responseStyle: 'academic',
            subject: '机器学习',
            includeReferences: true,
            maxTokens: 2000
          }
        }
      },
      {
        id: '2',
        title: 'CityU课程咨询',
        messages: [
          {
            id: '3',
            role: 'user',
            content: '请推荐一些CityU的AI相关课程',
            timestamp: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: '4',
            role: 'assistant',
            content: '基于CityU的课程设置，我推荐以下AI相关课程：\n\n1. **CS4487 机器学习** - 适合本科生，涵盖基础算法\n2. **CS5487 深度学习** - 研究生课程，深入神经网络\n3. **CS4486 人工智能** - AI基础理论和应用\n4. **CS5489 计算机视觉** - 图像处理和识别\n\n这些课程循序渐进，建议按顺序学习。',
            timestamp: new Date(Date.now() - 172800000 + 8000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000 + 8000).toISOString(),
        userId,
        context: {
          subject: 'CityU课程',
          documents: ['3'],
          preferences: {
            language: 'zh',
            responseStyle: 'detailed',
            subject: 'CityU课程',
            includeReferences: true,
            maxTokens: 2000
          }
        }
      }
    ];
  }
};

// AI响应生成逻辑
function generateAIResponse(userMessage: string, context?: any): {
  content: string;
  suggestions: string[];
  references: Array<{title: string; url?: string; type: 'document' | 'course' | 'paper' | 'website'}>;
} {
  const message = userMessage.toLowerCase();
  
  // 机器学习相关
  if (message.includes('机器学习') || message.includes('machine learning')) {
    return {
      content: `机器学习是人工智能的核心分支，它让计算机能够从数据中自动学习和改进性能。

## 主要类型

1. **监督学习** - 使用标记数据训练模型
   - 分类问题：预测离散标签
   - 回归问题：预测连续数值

2. **无监督学习** - 从未标记数据中发现模式
   - 聚类：将相似数据分组
   - 降维：减少数据特征数量

3. **强化学习** - 通过试错与环境交互学习
   - 智能体在环境中采取行动
   - 通过奖励信号优化策略

## CityU相关资源

在香港城市大学，您可以通过以下方式深入学习：
- CS4487 机器学习课程
- 数据科学学院的研究项目
- AI实验室的实践机会

建议从基础数学（线性代数、概率论）开始，然后学习具体算法实现。`,
      suggestions: [
        '深度学习和机器学习的区别是什么？',
        '如何选择合适的机器学习算法？',
        'CityU有哪些AI相关的研究方向？',
        '机器学习需要哪些数学基础？'
      ],
      references: [
        { title: '机器学习基础笔记', type: 'document' },
        { title: 'CS4487 机器学习', type: 'course' },
        { title: '《机器学习》- 周志华', type: 'paper' }
      ]
    };
  }
  
  // CityU相关
  if (message.includes('cityu') || message.includes('城市大学') || message.includes('香港城市大学')) {
    return {
      content: `香港城市大学（CityU）是一所享有国际声誉的研究型大学，在AI和科技领域表现卓越。

## 学术特色

### 🎓 优势学科
- **计算机科学** - QS世界排名前50
- **工程学** - 亚洲领先地位
- **商学院** - AACSB和EQUIS双重认证
- **创意媒体** - 亚洲首创数字媒体艺术

### 🔬 AI研究方向
1. **机器学习与数据挖掘**
2. **计算机视觉与图像处理**
3. **自然语言处理**
4. **智能机器人技术**
5. **金融科技与区块链**

### 🌟 校园文化
- **国际化环境** - 来自60多个国家的学生
- **创新精神** - Discovery-enriched Curriculum
- **产学研结合** - 与业界紧密合作

## 香港优势

作为国际金融中心，香港为CityU学生提供：
- 丰富的实习和就业机会
- 中西文化交融的学习环境
- 便利的地理位置连接内地和国际`,
      suggestions: [
        'CityU有哪些知名的AI教授？',
        '如何申请CityU的研究生项目？',
        'CityU的校园生活是怎样的？',
        '在香港学习AI有什么优势？'
      ],
      references: [
        { title: 'CityU AI课程规划', type: 'document' },
        { title: 'CityU官方网站', url: 'https://www.cityu.edu.hk', type: 'website' },
        { title: '计算机科学系', type: 'course' }
      ]
    };
  }
  
  // 学习方法相关
  if (message.includes('学习方法') || message.includes('如何学习') || message.includes('学习技巧')) {
    return {
      content: `高效学习需要科学的方法和持续的实践。以下是一些经过验证的学习策略：

## 🧠 认知科学原理

### 1. 主动学习
- **费曼技巧**：用简单语言解释复杂概念
- **自我测试**：定期检验学习效果
- **概念映射**：建立知识间的联系

### 2. 间隔重复
- 利用遗忘曲线优化复习时间
- 逐渐增加复习间隔
- 重点关注薄弱环节

### 3. 多元化学习
- **视觉学习**：图表、思维导图
- **听觉学习**：讲座、讨论
- **动手实践**：编程、实验

## 📚 CityU学习资源

### 学术支持
- **图书馆资源**：丰富的数字资源
- **学习中心**：写作和学术技能指导
- **同伴学习**：学习小组和讨论班

### 技术工具
- **LearnSphere平台**：个性化学习管理
- **在线课程**：Coursera、edX合作项目
- **研究数据库**：IEEE、ACM等学术资源

## 🎯 实用建议

1. **设定明确目标**：SMART原则制定学习计划
2. **时间管理**：番茄工作法、时间块规划
3. **环境优化**：创造专注的学习空间
4. **健康习惯**：充足睡眠、适度运动`,
      suggestions: [
        '如何制定有效的学习计划？',
        '怎样提高专注力和学习效率？',
        '如何平衡学习和生活？',
        '有哪些好用的学习工具推荐？'
      ],
      references: [
        { title: '学习方法论', type: 'document' },
        { title: 'CityU学习资源指南', type: 'course' },
        { title: '认知心理学研究', type: 'paper' }
      ]
    };
  }
  
  // 香港文化相关
  if (message.includes('香港') || message.includes('hong kong') || message.includes('文化')) {
    return {
      content: `香港是一个融合东西方文化的国际都市，拥有独特的文化魅力和学术环境。

## 🏙️ 香港文化特色

### 多元文化融合
- **中西合璧**：传统中华文化与现代西方文明
- **语言环境**：粤语、普通话、英语三语并用
- **宗教包容**：佛教、道教、基督教和谐共存

### 生活方式
- **茶餐厅文化**：港式奶茶、菠萝包等特色美食
- **购物天堂**：从传统街市到现代商场
- **夜生活**：维多利亚港夜景、庙街夜市

## 🎓 学术环境优势

### 国际化程度高
- 世界一流大学云集
- 国际学者和学生交流频繁
- 英语授课环境完善

### 地理位置优越
- 连接内地与国际的桥梁
- 便利的交通网络
- 丰富的实习就业机会

## 🌟 传统节庆

### 重要节日
- **春节**：舞龙舞狮、花市年宵
- **中秋节**：赏月、月饼文化
- **端午节**：龙舟竞渡
- **重阳节**：登高望远

### 现代庆典
- **国际电影节**：亚洲电影文化盛会
- **艺术节**：国际艺术交流平台
- **美食节**：展示多元饮食文化

在CityU学习，您不仅能获得优质教育，还能深度体验这座城市的文化魅力。`,
      suggestions: [
        '在香港生活需要注意什么？',
        '香港有哪些著名的景点和活动？',
        '如何更好地融入香港的学习环境？',
        '香港的就业前景如何？'
      ],
      references: [
        { title: '香港文化指南', type: 'document' },
        { title: '香港旅游发展局', url: 'https://www.discoverhongkong.com', type: 'website' },
        { title: 'CityU校园文化', type: 'course' }
      ]
    };
  }
  
  // 默认通用回复
  return {
    content: `感谢您的提问！作为CityU LearnSphere的AI学习助手，我很乐意为您提供帮助。

我可以协助您解决以下问题：

## 📚 学术支持
- 课程学习指导和答疑
- 研究方法和学术写作
- 文献检索和分析
- 学习计划制定

## 🎓 CityU相关
- 课程信息和选课建议
- 校园生活指导
- 学术资源推荐
- 职业发展规划

## 🤖 AI与技术
- 人工智能基础知识
- 编程学习指导
- 技术趋势分析
- 项目开发建议

## 🌏 香港文化
- 本地文化介绍
- 生活实用信息
- 语言学习支持
- 社交活动推荐

请告诉我您具体想了解什么，我会为您提供详细和个性化的回答！`,
    suggestions: [
      '我想了解机器学习的基础知识',
      '请介绍CityU的AI相关课程',
      '如何提高学习效率？',
      '香港有什么特色文化？'
    ],
    references: [
      { title: 'CityU LearnSphere用户指南', type: 'document' },
      { title: 'AI学习资源合集', type: 'course' }
    ]
  };
}

// 快速提示词
export const quickPrompts: QuickPrompt[] = [
  {
    id: '1',
    title: '课程学习',
    content: '请帮我制定一个关于{subject}的学习计划，包括学习目标、时间安排和资源推荐。',
    category: 'study',
    icon: '📚',
    description: '制定个性化学习计划'
  },
  {
    id: '2',
    title: '论文写作',
    content: '我正在写一篇关于{topic}的论文，请帮我分析论文结构和提供写作建议。',
    category: 'writing',
    icon: '✍️',
    description: '学术写作指导'
  },
  {
    id: '3',
    title: '概念解释',
    content: '请用简单易懂的方式解释{concept}这个概念，并提供一些实际应用例子。',
    category: 'study',
    icon: '💡',
    description: '复杂概念简化解释'
  },
  {
    id: '4',
    title: '文献分析',
    content: '请帮我分析这篇文献的主要观点、研究方法和贡献：{citation}',
    category: 'research',
    icon: '🔍',
    description: '学术文献深度分析'
  },
  {
    id: '5',
    title: '编程问题',
    content: '我在学习{programming_language}时遇到了问题：{problem}，请提供解决方案和代码示例。',
    category: 'study',
    icon: '💻',
    description: '编程学习支持'
  },
  {
    id: '6',
    title: 'CityU咨询',
    content: '我想了解CityU的{department}专业，请介绍课程设置、师资力量和就业前景。',
    category: 'general',
    icon: '🏫',
    description: 'CityU专业咨询'
  },
  {
    id: '7',
    title: '项目规划',
    content: '我想开始一个关于{project_topic}的项目，请帮我制定项目计划和里程碑。',
    category: 'research',
    icon: '🎯',
    description: '项目管理指导'
  },
  {
    id: '8',
    title: '香港生活',
    content: '作为新来香港的学生，请给我一些关于{aspect}的实用建议和注意事项。',
    category: 'general',
    icon: '🌏',
    description: '香港生活指南'
  }
];

// 消息处理工具
export const messageUtils = {
  // 生成消息ID
  generateMessageId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  },

  // 创建用户消息
  createUserMessage(content: string): ChatMessage {
    return {
      id: this.generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
  },

  // 创建AI消息
  createAIMessage(content: string, metadata?: any): ChatMessage {
    return {
      id: this.generateMessageId(),
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      metadata
    };
  },

  // 格式化时间显示
  formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return '刚刚';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  },

  // 计算会话摘要
  generateSessionSummary(messages: ChatMessage[]): string {
    if (messages.length === 0) return '新对话';
    
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (!firstUserMessage) return '新对话';
    
    const content = firstUserMessage.content;
    return content.length > 30 ? content.substring(0, 30) + '...' : content;
  }
};