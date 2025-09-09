import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Alert, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types';
import { validators } from '@/utils/auth';

const { Title, Text } = Typography;

export function LoginForm() {
  const [form] = Form.useForm();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: LoginCredentials) => {
    try {
      clearError();
      await login(values);
    } catch (error) {
      // 错误已在useAuth中处理
      console.error('Login failed:', error);
    }
  };

  const handleFormChange = () => {
    if (error) {
      clearError();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cityu-blue via-primary-600 to-primary-700 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl"></div>
      </div>

      <Card 
        className="w-full max-w-md relative z-10 shadow-2xl border-0"
        bodyStyle={{ padding: '2rem' }}
      >
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-cityu rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">CU</span>
          </div>
          <Title level={2} className="text-gray-800 mb-2">
            CityU LearnSphere
          </Title>
          <Text className="text-gray-600">
            AI驱动的个人知识管理平台
          </Text>
        </div>

        {/* 错误提示 */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={clearError}
            className="mb-6"
          />
        )}

        {/* 登录表单 */}
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          onChange={handleFormChange}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
              {
                validator: (_, value) => {
                  const error = validators.email(value);
                  return error ? Promise.reject(error) : Promise.resolve();
                }
              }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="请输入CityU邮箱"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              {
                validator: (_, value) => {
                  const error = validators.password(value);
                  return error ? Promise.reject(error) : Promise.resolve();
                }
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="请输入密码"
              size="large"
              className="rounded-lg"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between items-center">
              <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600">
                  记住我
                </Checkbox>
              </Form.Item>
              <Link 
                to="/auth/forgot-password" 
                className="text-cityu-blue hover:text-primary-700 text-sm"
              >
                忘记密码？
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
              className="w-full h-12 bg-cityu-blue hover:bg-primary-700 border-0 rounded-lg font-medium text-base"
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>

        <Divider className="my-6">
          <Text className="text-gray-500 text-sm">或</Text>
        </Divider>

        {/* 注册链接 */}
        <div className="text-center">
          <Text className="text-gray-600">
            还没有账号？{' '}
            <Link 
              to="/auth/register" 
              className="text-cityu-blue hover:text-primary-700 font-medium"
            >
              立即注册
            </Link>
          </Text>
        </div>

        {/* 演示账号提示 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Text className="text-blue-700 text-sm block mb-2 font-medium">
            演示账号：
          </Text>
          <Text className="text-blue-600 text-xs block">
            邮箱：student@cityu.edu.hk
          </Text>
          <Text className="text-blue-600 text-xs block">
            密码：password123
          </Text>
        </div>
      </Card>
    </div>
  );
}