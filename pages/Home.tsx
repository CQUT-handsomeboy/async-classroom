import React from 'react';
import { Search, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COURSES } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">异步课堂 <span className="text-primary text-sm font-normal px-2 py-0.5 bg-blue-900/30 rounded border border-blue-900">Beta</span></h1>
          <p className="text-slate-400">基于 Markdown 与版本控制的代码驱动式教育平台</p>
        </div>
        <div className="relative w-96">
          <input 
            type="text" 
            placeholder="搜索课程、知识点或 Manim 脚本..." 
            className="w-full bg-surface border border-slate-700 rounded-full py-2.5 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-primary transition-colors"
          />
          <Search className="absolute left-4 top-3 text-slate-500" size={18} />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {COURSES.map(course => (
          <Link key={course.id} to={`/teacher/${course.id}`} className="group block">
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
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
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
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
