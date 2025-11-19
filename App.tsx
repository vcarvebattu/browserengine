import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { generateSyllabus, generateChapterContent } from './services/gemini';
import { Chapter, CourseState, TabView } from './types';
import { ChapterNavigation } from './components/ChapterNavigation';
import { QuizView } from './components/QuizView';
import { LabView } from './components/LabView';
import { BookOpen, Code2, GraduationCap, BrainCircuit, Loader2, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<CourseState>({
    syllabus: [],
    currentChapterId: null,
    isGeneratingSyllabus: true,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<TabView>(TabView.THEORY);

  useEffect(() => {
    // Initial load: Generate the curriculum
    const initCourse = async () => {
      try {
        const syllabus = await generateSyllabus();
        setState(prev => ({
          ...prev,
          syllabus,
          isGeneratingSyllabus: false,
          currentChapterId: syllabus.length > 0 ? syllabus[0].id : null,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          isGeneratingSyllabus: false,
          error: err instanceof Error ? err.message : "Unknown error occurred",
        }));
      }
    };

    initCourse();
  }, []);

  useEffect(() => {
    // Load content when chapter changes if not already loaded
    const loadContent = async () => {
      if (state.currentChapterId === null) return;

      const chapterIdx = state.syllabus.findIndex(c => c.id === state.currentChapterId);
      if (chapterIdx === -1) return;

      const chapter = state.syllabus[chapterIdx];
      
      if (chapter.content || chapter.isLoading) return; // Already loaded or loading

      // Set loading state
      const newSyllabus = [...state.syllabus];
      newSyllabus[chapterIdx] = { ...chapter, isLoading: true };
      setState(prev => ({ ...prev, syllabus: newSyllabus }));

      try {
        const content = await generateChapterContent(chapter);
        const updatedSyllabus = [...state.syllabus];
        updatedSyllabus[chapterIdx] = { ...chapter, content, isLoading: false };
        setState(prev => ({ ...prev, syllabus: updatedSyllabus }));
      } catch (err) {
         const updatedSyllabus = [...state.syllabus];
        updatedSyllabus[chapterIdx] = { ...chapter, isLoading: false }; // Remove loading but keep null content to retry
        setState(prev => ({ ...prev, syllabus: updatedSyllabus, error: "Failed to load chapter content." }));
      }
    };

    loadContent();
  }, [state.currentChapterId, state.syllabus]);

  const handleSelectChapter = (id: number) => {
    setState(prev => ({ ...prev, currentChapterId: id }));
    setActiveTab(TabView.THEORY);
  };

  const handleQuizComplete = () => {
    if (state.currentChapterId === null) return;
    
    const updatedSyllabus = state.syllabus.map(c => 
      c.id === state.currentChapterId ? { ...c, isCompleted: true } : c
    );
    setState(prev => ({ ...prev, syllabus: updatedSyllabus }));
  };

  const currentChapter = state.syllabus.find(c => c.id === state.currentChapterId);

  if (state.isGeneratingSyllabus) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-4">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
          <BrainCircuit size={64} className="text-emerald-500 relative animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
          Designing Curriculum
        </h1>
        <p className="text-slate-400 max-w-md text-center mb-8">
          AI Architect is structuring the "Build a Browser" course for you. Preparing modules on Networking, HTML Parsing, Layout, and Rendering...
        </p>
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  if (state.error && state.syllabus.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-rose-500">
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto mb-4" />
          <h2 className="text-xl font-bold">Error Loading Course</h2>
          <p className="text-slate-400 mt-2">{state.error}</p>
           <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="flex h-screen w-full bg-slate-950 overflow-hidden text-slate-200 font-sans">
        <ChapterNavigation 
          chapters={state.syllabus} 
          currentChapterId={state.currentChapterId}
          onSelectChapter={handleSelectChapter}
        />

        <main className="flex-1 flex flex-col min-w-0 bg-slate-950/50 relative">
          {/* Top Bar */}
          {currentChapter && (
            <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 shrink-0 bg-slate-950">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-emerald-500">CURRENT MODULE</span>
                <h2 className="text-lg font-bold text-white">{currentChapter.title}</h2>
              </div>
              
              <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveTab(TabView.THEORY)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === TabView.THEORY ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen size={16} />
                  Theory
                </button>
                <button
                  onClick={() => setActiveTab(TabView.LAB)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === TabView.LAB ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 size={16} />
                  Lab
                </button>
                <button
                  onClick={() => setActiveTab(TabView.QUIZ)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === TabView.QUIZ ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap size={16} />
                  Quiz
                </button>
              </div>
            </header>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 scroll-smooth relative">
            {currentChapter?.isLoading ? (
               <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <Loader2 className="animate-spin mb-4" size={32} />
                  <p>Generating chapter content with Gemini...</p>
               </div>
            ) : currentChapter?.content ? (
              <>
                {activeTab === TabView.THEORY && (
                  <div className="max-w-4xl mx-auto prose prose-invert prose-slate prose-headings:text-emerald-400 prose-a:text-blue-400 prose-code:text-rose-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
                    {/* Simple Markdown Rendering - replacing newlines for simple structure */}
                    {currentChapter.content.theory.split('\n').map((line, i) => {
                      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-8 mb-4">{line.replace('### ', '')}</h3>
                      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-10 mb-4 border-b border-slate-800 pb-2">{line.replace('## ', '')}</h2>
                      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-4 mb-6">{line.replace('# ', '')}</h1>
                      if (line.startsWith('- ')) return <li key={i} className="ml-4 text-slate-300">{line.replace('- ', '')}</li>
                      if (line.trim() === '') return <br key={i}/>
                      return <p key={i} className="mb-4 text-slate-300 leading-7">{line}</p>
                    })}
                  </div>
                )}

                {activeTab === TabView.LAB && (
                  <LabView assignment={currentChapter.content.assignment} />
                )}

                {activeTab === TabView.QUIZ && (
                  <QuizView 
                    questions={currentChapter.content.quiz} 
                    onComplete={handleQuizComplete} 
                  />
                )}
              </>
            ) : (
               <div className="flex items-center justify-center h-full text-rose-400">
                 <p>Content failed to load. Please select the chapter again.</p>
               </div>
            )}
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;