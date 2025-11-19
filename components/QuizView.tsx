import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIdx];
  const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(p => p + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Chapter Quiz</h2>
        <span className="text-sm font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
          Question {currentIdx + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 shadow-xl">
        <p className="text-lg text-slate-200 mb-6 font-medium leading-relaxed">
          {currentQuestion.question}
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let stateStyles = "border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-300";
            
            if (isSubmitted) {
              if (idx === currentQuestion.correctAnswerIndex) {
                stateStyles = "border-emerald-500 bg-emerald-950/30 text-emerald-200";
              } else if (idx === selectedOption) {
                stateStyles = "border-rose-500 bg-rose-950/30 text-rose-200";
              } else {
                stateStyles = "border-slate-800 bg-slate-900/50 text-slate-500 opacity-50";
              }
            } else if (selectedOption === idx) {
              stateStyles = "border-blue-500 bg-blue-900/20 text-blue-200 ring-1 ring-blue-500";
            }

            return (
              <button
                key={idx}
                onClick={() => !isSubmitted && setSelectedOption(idx)}
                disabled={isSubmitted}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between group ${stateStyles}`}
              >
                <span>{option}</span>
                {isSubmitted && idx === currentQuestion.correctAnswerIndex && <CheckCircle size={20} className="text-emerald-500" />}
                {isSubmitted && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && <XCircle size={20} className="text-rose-500" />}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className={`mt-6 p-4 rounded-lg border ${isCorrect ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-rose-950/20 border-rose-900/50'}`}>
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className={isCorrect ? 'text-emerald-400' : 'text-rose-400'} />
              <div>
                <h4 className={`font-bold mb-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};