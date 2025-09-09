import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Document, DocumentState, CreateDocumentData, UpdateDocumentData } from '@/types/document';
import { documentAPI } from '@/utils/document';

// 文档状态的初始值
const initialState: DocumentState = {
  documents: [],
  folders: [],
  currentDocument: null,
  isLoading: false,
  error: null,
  searchResults: [],
  recentDocuments: [],
};

// 文档状态的Action类型
type DocumentAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Document[] }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'SET_CURRENT_DOCUMENT'; payload: Document | null }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: Document[] }
  | { type: 'ADD_TO_RECENT'; payload: Document }
  | { type: 'CLEAR_ERROR' };

// 文档状态的Reducer
function documentReducer(state: DocumentState, action: DocumentAction): DocumentState {
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
        documents: action.payload,
        isLoading: false,
        error: null,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'SET_CURRENT_DOCUMENT':
      return {
        ...state,
        currentDocument: action.payload,
      };
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [action.payload, ...state.documents],
      };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? action.payload : doc
        ),
        currentDocument: state.currentDocument?.id === action.payload.id 
          ? action.payload 
          : state.currentDocument,
      };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
        currentDocument: state.currentDocument?.id === action.payload 
          ? null 
          : state.currentDocument,
      };
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
      };
    case 'ADD_TO_RECENT':
      const recentDocuments = [
        action.payload,
        ...state.recentDocuments.filter(doc => doc.id !== action.payload.id)
      ].slice(0, 10); // 保持最近10个文档
      return {
        ...state,
        recentDocuments,
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

// 文档上下文类型
interface DocumentContextType extends DocumentState {
  fetchDocuments: () => Promise<void>;
  getDocument: (id: string) => Promise<void>;
  createDocument: (data: CreateDocumentData) => Promise<Document>;
  updateDocument: (id: string, data: UpdateDocumentData) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  searchDocuments: (query: string) => Promise<void>;
  setCurrentDocument: (document: Document | null) => void;
  clearError: () => void;
}

// 创建文档上下文
const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// 文档提供者组件
interface DocumentProviderProps {
  children: ReactNode;
}

export function DocumentProvider({ children }: DocumentProviderProps) {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  // 获取所有文档
  const fetchDocuments = async () => {
    try {
      dispatch({ type: 'FETCH_START' });
      const documents = await documentAPI.getDocuments();
      dispatch({ type: 'FETCH_SUCCESS', payload: documents });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取文档失败';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
    }
  };

  // 获取单个文档
  const getDocument = async (id: string) => {
    try {
      dispatch({ type: 'FETCH_START' });
      const document = await documentAPI.getDocument(id);
      dispatch({ type: 'SET_CURRENT_DOCUMENT', payload: document });
      dispatch({ type: 'ADD_TO_RECENT', payload: document });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取文档失败';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
    }
  };

  // 创建文档
  const createDocument = async (data: CreateDocumentData): Promise<Document> => {
    try {
      const document = await documentAPI.createDocument(data);
      dispatch({ type: 'ADD_DOCUMENT', payload: document });
      return document;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建文档失败';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // 更新文档
  const updateDocument = async (id: string, data: UpdateDocumentData) => {
    try {
      const document = await documentAPI.updateDocument(id, data);
      dispatch({ type: 'UPDATE_DOCUMENT', payload: document });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新文档失败';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // 删除文档
  const deleteDocument = async (id: string) => {
    try {
      await documentAPI.deleteDocument(id);
      dispatch({ type: 'DELETE_DOCUMENT', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除文档失败';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // 搜索文档
  const searchDocuments = async (query: string) => {
    try {
      const results = await documentAPI.searchDocuments(query);
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '搜索失败';
      dispatch({ type: 'FETCH_FAILURE', payload: errorMessage });
    }
  };

  // 设置当前文档
  const setCurrentDocument = (document: Document | null) => {
    dispatch({ type: 'SET_CURRENT_DOCUMENT', payload: document });
    if (document) {
      dispatch({ type: 'ADD_TO_RECENT', payload: document });
    }
  };

  // 清除错误
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // 初始化时获取文档列表
  useEffect(() => {
    fetchDocuments();
  }, []);

  const contextValue: DocumentContextType = {
    ...state,
    fetchDocuments,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    searchDocuments,
    setCurrentDocument,
    clearError,
  };

  return (
    <DocumentContext.Provider value={contextValue}>
      {children}
    </DocumentContext.Provider>
  );
}

// 使用文档上下文的Hook
export function useDocuments(): DocumentContextType {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}