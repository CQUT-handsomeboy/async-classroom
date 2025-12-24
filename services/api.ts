// API服务
const API_BASE_URL = 'https://frp-put.com:33747/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
}

export interface Script {
  title: string;
  content: string;
  task_id: string;
  status: string;
  id: string;
  created_at: string;
  video_path: string;
  video_url: string;
  srt_path: string;
  srt_url: string;
  updated_at: string;
}

export interface ScriptsResponse {
  scripts: Script[];
  count: number;
}

class ApiService {
  private accessToken: string | null = null;

  // 登录获取token
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('🔐 尝试登录:', credentials.username);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('🔐 登录响应状态:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 登录失败:', errorText);
        throw new Error(`登录失败: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: LoginResponse = await response.json();
      console.log('✅ 登录成功:', data);
      
      this.accessToken = data.access_token;
      
      // 保存token到localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('username', data.username);
      
      return data;
    } catch (error) {
      console.error('❌ 登录异常:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('网络连接失败，请检查网络连接或稍后重试');
      }
      throw error;
    }
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!(this.accessToken || localStorage.getItem('access_token'));
  }

  // 获取当前用户名
  getCurrentUsername(): string | null {
    return localStorage.getItem('username');
  }

  // 清除认证信息
  clearAuth(): void {
    this.accessToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
  }

  // 登出
  logout(): void {
    this.clearAuth();
  }

  // 获取访问令牌
  private getAccessToken(): string | null {
    return this.accessToken || localStorage.getItem('access_token');
  }

  // 获取课程数据（从任务转换）
  async getCourseDataFromTasks(offset: number = 0, limit: number | null = null): Promise<Course[]> {
    console.log('📋 获取课程数据（从任务转换）, offset:', offset, 'limit:', limit);
    
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('未登录，请先登录');
    }

    try {
      const url = new URL(`${API_BASE_URL}/tasks`);
      url.searchParams.append('offset', offset.toString());
      if (limit !== null) {
        url.searchParams.append('limit', limit.toString());
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📋 任务列表响应状态:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuth();
          throw new Error('登录已过期，请重新登录');
        }
        const errorText = await response.text();
        console.error('❌ 获取任务列表失败:', errorText);
        throw new Error(`获取任务列表失败: ${response.status} ${response.statusText}`);
      }

      const data: TasksResponse = await response.json();
      console.log('✅ 获取任务列表成功:', data);
      
      // 将任务转换为课程格式
      const courses = tasksResponseToCourses(data);
      console.log('✅ 转换为课程格式完成:', courses);

      return courses;
    } catch (error) {
      console.error('❌ 获取课程数据异常:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('网络连接失败，请检查网络连接或稍后重试');
      }
      throw error;
    }
  }
}

export const apiService = new ApiService();

// 将API脚本转换为Course格式
export function scriptToCourse(script: Script): Course {
  console.log('🔄 转换脚本到课程格式:', script);
  
  // 生成随机封面图片
  const randomId = Math.floor(Math.random() * 1000);
  
  // 获取用户名作为作者
  const author = apiService.getCurrentUsername() || '未知用户';
  
  const course: Course = {
    id: script.id,
    title: script.title,
    author: author,
    thumbnail: `https://picsum.photos/400/225?random=${randomId}`,
    description: '', // 按要求去掉描述
    duration: '未知', // API没有提供时长信息
    views: Math.floor(Math.random() * 10000), // 随机生成观看次数
    created_at: script.created_at,
    video_url: script.video_url,
  };
  
  console.log('✅ 转换完成:', course);
  return course;
}

// 导入Course类型
import { Course, Task, TasksResponse } from '../types';

// 将Task转换为Course格式
export function taskToCourse(task: Task): Course {
  console.log('🔄 转换任务到课程格式:', task);
  
  // 生成随机封面图片
  const randomId = Math.floor(Math.random() * 1000);
  
  // 格式化创建时间
  const createdDate = new Date(task.created_at * 1000); // Task的created_at是时间戳（秒）
  const formattedDate = createdDate.toLocaleDateString('zh-CN');
  
  // 获取用户名作为作者
  const author = apiService.getCurrentUsername() || '未知用户';
  
  const course: Course = {
    id: task.task_id,
    title: `任务 ${task.task_id}`,
    author: author,
    thumbnail: `https://picsum.photos/400/225?random=${randomId}`,
    description: '', // 使用code字段作为描述
    duration: '未知', // API没有提供时长信息
    views: Math.floor(Math.random() * 10000), // 随机生成观看次数
    created_at: new Date(task.created_at * 1000).toISOString(),
    video_url: task.video_url,
  };
  
  console.log('✅ 转换完成:', course);
  return course;
}

// 将TasksResponse转换为Course数组
export function tasksResponseToCourses(tasksResponse: TasksResponse): Course[] {
  console.log('🔄 转换任务响应到课程数组:', tasksResponse);
  
  const courses = tasksResponse.tasks.map(task => taskToCourse(task));
  
  console.log('✅ 转换完成，共', courses.length, '个课程');
  return courses;
}