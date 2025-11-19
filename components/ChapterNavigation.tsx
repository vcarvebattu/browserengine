import React from 'react';
import { Chapter } from '../types';
import { CheckCircle2, Circle, Lock, ChevronRight, BookOpen } from 'lucide-react';

interface ChapterNavigationProps {
  chapters: Chapter[];
  currentChapterId: number | null;
  onSelectChapter: (id: number) => void;
}

export const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  chapters,
  currentChapterId,
  onSelectChapter,
}) => {
  return (
    <nav className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 text-emerald-400 mb-2">
          <BookOpen size={24} />
          <h1 className="text-xl font-bold tracking-tight text-slate-100">BrowserEngine</h1>
        </div>
        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Course Curriculum</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === currentChapterId;
          // Unlock next chapter if previous is completed (mock logic: all unlocked for demo)
          const isLocked = false; 

          return (
            <button
              key={chapter.id}
              onClick={() => !isLocked && onSelectChapter(chapter.id)}
              disabled={isLocked}
              className={`w-full text-left group relative flex items-start gap-3 p-3 rounded-lg transition-all duration-200 border ${
                isActive
                  ? 'bg-slate-800 border-emerald-500/50 shadow-lg shadow-emerald-900/20'
                  : 'bg-transparent border-transparent hover:bg-slate-800/50'
              } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="mt-1 shrink-0">
                {chapter.isCompleted ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : isLocked ? (
                  <Lock size={18} className="text-slate-600" />
                ) : (
                  <Circle size={18} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono mb-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    CHAPTER {index + 1}
                  </span>
                </div>
                <h3 className={`text-sm font-medium leading-snug ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                  {chapter.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{chapter.shortDescription}</p>
              </div>

              {isActive && (
                <ChevronRight size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded p-3">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Progress</span>
            <span>{Math.round((chapters.filter(c => c.isCompleted).length / chapters.length) * 100) || 0}%</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${(chapters.filter(c => c.isCompleted).length / chapters.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};