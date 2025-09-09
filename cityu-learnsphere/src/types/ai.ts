export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    tokens?: number;
    model?: string;
    temperature?: number;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  context?: {
    subject?: string;
    documents?: string[];
    preferences?: ChatPreferences;
  };
}

export interface ChatPreferences {
  language: 'zh' | 'en';
  responseStyle: 'academic' | 'casual' | 'detailed' | 'concise';
  subject: string;
  includeReferences: boolean;
  maxTokens: number;
}

export interface AIAssistantState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  preferences: ChatPreferences;
}

export interface SendMessageRequest {
  content: string;
  sessionId?: string;
  context?: {
    documents?: string[];
    subject?: string;
  };
}

export interface AIResponse {
  content: string;
  tokens: number;
  model: string;
  suggestions?: string[];
  references?: Array<{
    title: string;
    url?: string;
    type: 'document' | 'course' | 'paper' | 'website';
  }>;
}

export interface LearningContext {
  currentCourse?: string;
  studyGoals?: string[];
  knowledgeLevel?: 'beginner' | 'intermediate' | 'advanced';
  interests?: string[];
  recentDocuments?: string[];
}

export interface QuickPrompt {
  id: string;
  title: string;
  content: string;
  category: 'study' | 'research' | 'writing' | 'analysis' | 'general';
  icon: string;
  description: string;
}