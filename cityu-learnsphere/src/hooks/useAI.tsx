import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  AIAssistantState, 
  ChatSession, 
  ChatMessage, 
  SendMessageRequest, 
  ChatPreferences 
} from '@/types/ai';
import { aiAPI, messageUtils } from '@/utils/ai';
import { useAuth } from './useAuth';

// AI助手状态的初始值
const initialState: AIAssistantState = {
  sessions: [],
  currentSession: null,
  isLoading: false,
  isTyping: false,
  error: null,
  preferences: {
    language: 'zh',
    responseStyle: 'academic',
    subject: '通用学习',
    includeReferences: true,
    maxTokens: 2000
  }
};

// AI助手状态的Action类型
type AIAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: ChatSession[] }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'SET_CURRENT_SESSION'; payload: ChatSession | null }
  | { type: 'ADD_SESSION'; payload: ChatSession }
  | { type: 'UPDATE_SESSION'; payload: ChatSession }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { sessionId: string; message: ChatMessage } }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<ChatPreferences> }
  | { type: 'CLEAR_ERROR' };

// AI助手状态的Reducer
function aiReducer(state: AIAssistantState, action: AIAction): AIAssistantState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        sessions: action.payload,
        isLoading: false,
        error: null,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SET_CURRENT_SESSION':
      return {
        ...state,
        currentSession: action.payload,
      };
    case 'ADD_SESSION':
      return {
        ...state,
        sessions: [action.payload, ...state.sessions],
        currentSession: action.payload,
      };
    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.id ? action.payload : session
        ),
        currentSession: state.currentSession?.id === action.payload.id 
          ? action.payload 
          : state.currentSession,
      };
    case 'DELETE_SESSION':
      const filteredSessions = state.sessions.filter(session => session.id !== action.payload);
      return {
        ...state,
        sessions: filteredSessions,
        currentSession: state.currentSession?.id === action.payload 
          ? (filteredSessions.length > 0 ? filteredSessions[0] : null)
          : state.currentSession,
      };
    case 'ADD_MESSAGE':
      const { sessionId, message } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === sessionId
            ? {
                ...session,
                messages: [...session.messages, message],
                updatedAt: new Date().toISOString(),
              }
            : session
        ),
        currentSession: state.currentSession?.id === sessionId
          ? {
              ...state.currentSession,
              messages: [...state.currentSession.messages, message],
              updatedAt: new Date().toISOString(),
            }
          : state.currentSession,
      };
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// AI助手上下文类型
interface AIContextType extends AIAssistantState {
  fetchSessions: () => Promise<void>;
  createSession: (title?: string) => Promise<ChatSession>;
  deleteSession: (sessionId: string) => Promise<void>;
  setCurrentSession: (session: ChatSession | null) => void;
  sendMessage: (request: SendMessageRequest) => Promise<void>;
  updatePreferences: (preferences: Partial<ChatPreferences>) => void;
  clearError: () => void;
}

// 创建AI助手上下文
const AIContext = createContext<AIContextType | undefined>(undefined);

// AI助手提供者组件
interface AIProviderProps {
  children: ReactNode;
}

export function AIProvider({ children }: AIProviderProps) {
  const [state, dispatch] = useReducer(aiReducer, initialState);
  const { user } = useAuth();

  // 获取所有会话
  const fetchSessions = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: 'FETCH_START' });
      const sessions = await aiAPI.getSessions(user.id);
      dispatch({ type: 'FETCH_SUCCESS', payload: sessions });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取会话失败';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
    }
  };

  // 创建新会话
  const createSession = async (title?: string): Promise<ChatSession> => {
    if (!user) throw new Error('用户未登录');
    
    try {
      const sessionTitle = title || `新对话 ${new Date().toLocaleString('zh-CN')}`;
      const session = await aiAPI.createSession(sessionTitle, user.id);
      dispatch({ type: 'ADD_SESSION', payload: session });
      return session;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建会话失败';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // 删除会话
  const deleteSession = async (sessionId: string) => {
    try {
      // 这里应该调用API删除会话
      dispatch({ type: 'DELETE_SESSION', payload: sessionId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除会话失败';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // 设置当前会话
  const setCurrentSession = (session: ChatSession | null) => {
    dispatch({ type: 'SET_CURRENT_SESSION', payload: session });
  };

  // 发送消息
  const sendMessage = async (request: SendMessageRequest) => {
    try {
      let sessionId = request.sessionId;
      
      // 如果没有指定会话ID，创建新会话
      if (!sessionId) {
        const newSession = await createSession();
        sessionId = newSession.id;
      }

      // 添加用户消息
      const userMessage = messageUtils.createUserMessage(request.content);
      dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message: userMessage } });

      // 设置AI正在输入状态
      dispatch({ type: 'SET_TYPING', payload: true });

      try {
        // 调用AI API
        const aiResponse = await aiAPI.sendMessage(request);
        
        // 添加AI回复消息
        const aiMessage = messageUtils.createAIMessage(aiResponse.content, {
          tokens: aiResponse.tokens,
          model: aiResponse.model,
          suggestions: aiResponse.suggestions,
          references: aiResponse.references
        });
        
        dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message: aiMessage } });
        
        // 更新会话标题（如果是第一条消息）
        const currentSession = state.sessions.find(s => s.id === sessionId);
        if (currentSession && currentSession.messages.length === 0) {
          const updatedSession = {
            ...currentSession,
            title: messageUtils.generateSessionSummary([userMessage]),
            messages: [userMessage, aiMessage],
            updatedAt: new Date().toISOString()
          };
          dispatch({ type: 'UPDATE_SESSION', payload: updatedSession });
        }
        
      } catch (error) {
        // 添加错误消息
        const errorMessage = messageUtils.createAIMessage(
          '抱歉，我现在无法回复您的消息。请稍后再试。',
          { error: true }
        );
        dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message: errorMessage } });
        throw error;
      } finally {
        dispatch({ type: 'SET_TYPING', payload: false });
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发送消息失败';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
      dispatch({ type: 'SET_TYPING', payload: false });
      throw error;
    }
  };

  // 更新偏好设置
  const updatePreferences = (preferences: Partial<ChatPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    
    // 保存到本地存储
    const updatedPreferences = { ...state.preferences, ...preferences };
    localStorage.setItem('ai_preferences', JSON.stringify(updatedPreferences));
  };

  // 清除错误
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // 初始化时获取会话列表和偏好设置
  useEffect(() => {
    if (user) {
      fetchSessions();
      
      // 从本地存储加载偏好设置
      const savedPreferences = localStorage.getItem('ai_preferences');
      if (savedPreferences) {
        try {
          const preferences = JSON.parse(savedPreferences);
          dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
        } catch (error) {
          console.error('Failed to load AI preferences:', error);
        }
      }
    }
  }, [user]);

  const contextValue: AIContextType = {
    ...state,
    fetchSessions,
    createSession,
    deleteSession,
    setCurrentSession,
    sendMessage,
    updatePreferences,
    clearError,
  };

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
}

// 使用AI助手上下文的Hook
export function useAI(): AIContextType {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}