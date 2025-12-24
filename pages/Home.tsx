import React, { useState, useEffect } from 'react';
import { Search, Clock, Eye, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Course } from '../types';
import LoginForm from '../components/LoginForm';

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 检查登录状态
  useEffect(() => {
    setIsAuthenticated(apiService.isAuthenticated());
  }, []);

  useEffect(() => {
    if(isAuthenticated) fetchScripts()
  },[isAuthenticated])

  // 获取课程列表
  const fetchScripts = async () => {
    console.log('🔄 开始获取课程列表...');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📡 调用API获取课程...');
      const coursesData = await apiService.getCourseDataFromTasks();
      console.log('✅ API响应:', coursesData);
      
      setCourses(coursesData);
      console.log('✅ 课程列表设置完成，数量:', coursesData.length);
    } catch (err) {
      console.error('❌ 获取课程失败:', err);
      setError(err instanceof Error ? err.message : '获取课程列表失败');
      if (err instanceof Error && err.message.includes('登录已过期')) {
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    console.log('✅ 登录成功，设置认证状态');
    setIsAuthenticated(true);
    fetchScripts();
  };

  // 登出处理
  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setCourses([]);
  };

  // 如果未登录，显示登录表单
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            异步课堂 
            <span className="text-primary text-sm font-normal px-2 py-0.5 bg-blue-900/30 rounded border border-blue-900 ml-2">
              Beta
            </span>
          </h1>
          <p className="text-slate-400">由脚本驱动与版本控制的教育平台</p>
          {apiService.getCurrentUsername() && (
            <p className="text-slate-500 text-sm mt-1">
              欢迎回来，{apiService.getCurrentUsername()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-96">
            <input 
              type="text" 
              placeholder="搜索课程、知识点或 Manim 脚本..." 
              className="w-full bg-surface border border-slate-700 rounded-full py-2.5 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-primary transition-colors"
            />
            <Search className="absolute left-4 top-3 text-slate-500" size={18} />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
            title="登出"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="ml-3 text-slate-400">加载中...</span>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="bg-red-900/20 border border-red-900 rounded-lg p-4 mb-8">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchScripts}
            className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
          >
            重试
          </button>
        </div>
      )}

      {/* 课程列表 */}
      {!isLoading && courses.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">暂无课程内容</p>
          <p className="text-slate-500 text-sm mt-2">请稍后再试或联系管理员</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <Link key={course.id} to={`/workspace/${course.id}`} className="group block">
            <div className="bg-surface rounded-xl overflow-hidden border border-slate-700 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-mono text-white">
                  {course.duration}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                        {course.author.charAt(0)}
                    </div>
                    <span>{course.author}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Eye size={14}/> {course.views}</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> {course.duration}</span>
                  </div>
                </div>
                {course.created_at && (
                  <div className="mt-2 text-xs text-slate-600">
                    创建于 {new Date(course.created_at).toLocaleDateString('zh-CN')}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
