import { User, LoginCredentials, RegisterData } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 模拟API调用 - 在实际项目中这些会连接到真实的后端API
export const authAPI = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟登录验证
    if (credentials.email === 'student@cityu.edu.hk' && credentials.password === 'password123') {
      const user: User = {
        id: '1',
        email: credentials.email,
        username: 'cityu_student',
        fullName: '张小明',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        department: '计算机科学系',
        studentId: '12345678',
        role: 'student',
        preferences: {
          language: 'zh',
          theme: 'light',
          notifications: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      return { user, token };
    }
    
    throw new Error('邮箱或密码错误');
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟注册验证
    if (data.email.includes('@cityu.edu.hk')) {
      const user: User = {
        id: Date.now().toString(),
        email: data.email,
        username: data.username,
        fullName: data.fullName,
        department: data.department,
        studentId: data.studentId,
        role: data.role,
        preferences: {
          language: 'zh',
          theme: 'light',
          notifications: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      return { user, token };
    }
    
    throw new Error('请使用CityU邮箱注册');
  },

  async getCurrentUser(token: string): Promise<User> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟从token获取用户信息
    const user: User = {
      id: '1',
      email: 'student@cityu.edu.hk',
      username: 'cityu_student',
      fullName: '张小明',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      department: '计算机科学系',
      studentId: '12345678',
      role: 'student',
      preferences: {
        language: 'zh',
        theme: 'light',
        notifications: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return user;
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟更新用户资料
    const updatedUser: User = {
      id: userId,
      email: 'student@cityu.edu.hk',
      username: 'cityu_student',
      fullName: data.fullName || '张小明',
      avatar: data.avatar,
      department: data.department || '计算机科学系',
      studentId: '12345678',
      role: 'student',
      preferences: {
        language: data.preferences?.language || 'zh',
        theme: data.preferences?.theme || 'light',
        notifications: data.preferences?.notifications ?? true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return updatedUser;
  }
};

// Token管理工具
export const tokenManager = {
  getToken(): string | null {
    return localStorage.getItem('cityu_auth_token');
  },

  setToken(token: string): void {
    localStorage.setItem('cityu_auth_token', token);
  },

  removeToken(): void {
    localStorage.removeItem('cityu_auth_token');
  },

  isTokenValid(token: string): boolean {
    // 简单的token验证逻辑
    return token && token.startsWith('mock-jwt-token-');
  }
};

// 表单验证工具
export const validators = {
  email: (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return '请输入邮箱地址';
    if (!emailRegex.test(email)) return '请输入有效的邮箱地址';
    if (!email.includes('@cityu.edu.hk')) return '请使用CityU邮箱地址';
    return null;
  },

  password: (password: string): string | null => {
    if (!password) return '请输入密码';
    if (password.length < 6) return '密码长度至少6位';
    return null;
  },

  confirmPassword: (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return '请确认密码';
    if (password !== confirmPassword) return '两次输入的密码不一致';
    return null;
  },

  username: (username: string): string | null => {
    if (!username) return '请输入用户名';
    if (username.length < 3) return '用户名长度至少3位';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return '用户名只能包含字母、数字和下划线';
    return null;
  },

  fullName: (fullName: string): string | null => {
    if (!fullName) return '请输入姓名';
    if (fullName.length < 2) return '姓名长度至少2位';
    return null;
  }
};