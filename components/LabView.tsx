import React from 'react';
import { Terminal, Play, Copy } from 'lucide-react';

interface LabViewProps {
  assignment: {
    title: string;
    description: string;
    starterCode: string;
    expectedOutput: string;
  };
}

export const LabView: React.FC<LabViewProps> = ({ assignment }) => {
  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{assignment.title}</h2>
        <p className="text-slate-400 leading-relaxed">{assignment.description}</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col gap-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col h-full shadow-2xl">
            <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">implementation.ts</span>
              <button 
                onClick={() => navigator.clipboard.writeText(assignment.starterCode)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                title="Copy Code"
              >
                <Copy size={14} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto bg-[#0f172a]">
              <pre className="font-mono text-sm text-blue-100 leading-relaxed whitespace-pre-wrap">
                {assignment.starterCode}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
           <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-sm font-bold text-emerald-400 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Terminal size={16} />
              Expected Output
            </h3>
             <div className="bg-black/50 rounded-lg p-4 border border-slate-800 font-mono text-sm text-emerald-300">
               {assignment.expectedOutput}
             </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 flex-1">
            <h3 className="text-sm font-bold text-slate-300 mb-3">Instructions</h3>
            <ul className="list-disc list-inside text-slate-400 space-y-2 text-sm">
              <li>Copy the starter code into your local environment.</li>
              <li>Implement the missing methods marked with <code className="bg-slate-800 px-1 rounded text-rose-300">TODO</code>.</li>
              <li>Run the code using a TypeScript runner (e.g., <code className="bg-slate-800 px-1 rounded">ts-node</code>).</li>
              <li>Verify your output matches the expected output block above.</li>
            </ul>
            
            <div className="mt-6 pt-6 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 italic">
                    Note: Since this is a browser environment, we cannot execute Node.js raw socket code here. Please perform this lab in your local VS Code setup.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};