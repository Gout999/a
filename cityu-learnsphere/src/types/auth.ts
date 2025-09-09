export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  department?: string;
  studentId?: string;
  role: 'student' | 'faculty' | 'researcher';
  preferences: {
    language: 'zh' | 'en';
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  department?: string;
  studentId?: string;
  role: 'student' | 'faculty' | 'researcher';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}