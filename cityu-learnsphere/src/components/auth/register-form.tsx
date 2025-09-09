import React, { useState } from 'react';
import { Form, Input, Button, Select, Alert, Card, Typography, Steps } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, BankOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RegisterData } from '@/types';
import { validators } from '@/utils/auth';

const { Title, Text } = Typography;
const { Option } = Select;

export function RegisterForm() {
  const [form] = Form.useForm();
  const { register, isLoading, error, clearError } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const departments = [
    '计算机科学系',
    '电子工程系',
    '机械工程系',
    '商学院',
    '文学院',
    '理学院',
    '工学院',
    '创意媒体学院',
    '能源及环境学院',
    '法律学院',
    '兽医学院',
    '数据科学学院'
  ];

  const handleSubmit = async (values: RegisterData) => {
    try {
      clearError();
      await register(values);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleFormChange = () => {
    if (error) {
      clearError();
    }
  };

  const nextStep = async () => {
    try {
      const values = await form.validateFields(['email', 'username', 'fullName']);
      if (values) {
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prevStep = () => {
    setCurrentStep(0);
  };

  const steps = [
    {
      title: '基本信息',
      description: '填写个人基本信息',
    },
    {
      title: '学术信息',
      description: '完善学术背景',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cityu-blue via-primary-600 to-primary-700 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl"></div>
      </div>

      <Card 
        className="w-full max-w-lg relative z-10 shadow-2xl border-0"
        bodyStyle={{ padding: '2rem' }}
      >
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-cityu rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">CU</span>
          </div>
          <Title level={2} className="text-gray-800 mb-2">
            加入 CityU LearnSphere
          </Title>
          <Text className="text-gray-600">
            开启您的智能学习之旅
          </Text>
        </div>

        {/* 步骤指示器 */}
        <Steps
          current={currentStep}
          items={steps}
          className="mb-8"
          size="small"
        />

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

        {/* 注册表单 */}
        <Form
          form={form}
          name="register"
          onFinish={handleSubmit}
          onChange={handleFormChange}
          layout="vertical"
          requiredMark={false}
        >
          {currentStep === 0 && (
            <>
              <Form.Item
                name="email"
                label="CityU邮箱"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  {
                    validator: (_, value) => {
                      const error = validators.email(value);
                      return error ? Promise.reject(error) : Promise.resolve();
                    }
                  }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="your.name@cityu.edu.hk"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  {
                    validator: (_, value) => {
                      const error = validators.username(value);
                      return error ? Promise.reject(error) : Promise.resolve();
                    }
                  }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="请输入用户名"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="fullName"
                label="姓名"
                rules={[
                  { required: true, message: '请输入姓名' },
                  {
                    validator: (_, value) => {
                      const error = validators.fullName(value);
                      return error ? Promise.reject(error) : Promise.resolve();
                    }
                  }
                ]}
              >
                <Input
                  prefix={<IdcardOutlined className="text-gray-400" />}
                  placeholder="请输入真实姓名"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  onClick={nextStep}
                  size="large"
                  className="w-full h-12 bg-cityu-blue hover:bg-primary-700 border-0 rounded-lg font-medium text-base"
                >
                  下一步
                </Button>
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              <Form.Item
                name="role"
                label="身份"
                rules={[{ required: true, message: '请选择您的身份' }]}
              >
                <Select
                  placeholder="请选择您的身份"
                  size="large"
                  className="rounded-lg"
                >
                  <Option value="student">学生</Option>
                  <Option value="faculty">教职员工</Option>
                  <Option value="researcher">研究人员</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="department"
                label="院系"
                rules={[{ required: true, message: '请选择您的院系' }]}
              >
                <Select
                  placeholder="请选择您的院系"
                  size="large"
                  className="rounded-lg"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {departments.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="studentId"
                label="学号/工号"
                rules={[
                  { required: true, message: '请输入学号或工号' },
                  { pattern: /^\d{8}$/, message: '请输入8位数字' }
                ]}
              >
                <Input
                  prefix={<BankOutlined className="text-gray-400" />}
                  placeholder="请输入8位学号或工号"
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
                  placeholder="请输入密码（至少6位）"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认密码"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const error = validators.confirmPassword(getFieldValue('password'), value);
                      return error ? Promise.reject(error) : Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="请再次输入密码"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <div className="flex gap-3">
                <Button
                  onClick={prevStep}
                  size="large"
                  className="flex-1 h-12 rounded-lg font-medium text-base"
                >
                  上一步
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  size="large"
                  className="flex-1 h-12 bg-cityu-blue hover:bg-primary-700 border-0 rounded-lg font-medium text-base"
                >
                  {isLoading ? '注册中...' : '完成注册'}
                </Button>
              </div>
            </>
          )}
        </Form>

        {/* 登录链接 */}
        <div className="text-center mt-6">
          <Text className="text-gray-600">
            已有账号？{' '}
            <Link 
              to="/auth/login" 
              className="text-cityu-blue hover:text-primary-700 font-medium"
            >
              立即登录
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}