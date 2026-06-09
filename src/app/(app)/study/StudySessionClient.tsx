"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Pause, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import type { Flashcard } from "@prisma/client";

export default function StudySessionClient({
  materialTitle,
  flashcards,
}: {
  materialTitle: string;
  flashcards: Flashcard[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progressPercent = Math.round(((currentIndex) / flashcards.length) * 100);

  const handleGrade = () => {
    if (currentIndex < flashcards.length - 1) {
      setShowAnswer(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowAnswer(false);
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-10 rounded-2xl border border-[#E5E7EB] shadow-sm max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-[#111827] mb-2">Session Complete</h2>
          <p className="text-sm md:text-base text-[#6B7280] mb-8">You successfully reviewed {flashcards.length} flashcards from {materialTitle}.</p>
          
          <Link href="/dashboard" className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#111827] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors">
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#E5E7EB] selection:text-[#111827]">
      
      {/* Top Navigation / Zen Mode Bar */}
      <header className="h-16 border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-6 bg-white shrink-0">
        <Link href="/dashboard" className="flex items-center text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-xs sm:text-sm font-medium text-[#111827] truncate max-w-[150px] sm:max-w-[200px]">{materialTitle}</span>
          <div className="w-px h-4 bg-[#E5E7EB]"></div>
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-mono text-[#6B7280]">{currentIndex + 1} / {flashcards.length}</span>
            <div className="w-16 sm:w-24 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div className="h-full bg-[#111827] transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <button className="flex items-center text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors">
          <Pause className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Pause</span>
        </button>
      </header>

      {/* Center Stage: The Flashcard */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 relative overflow-hidden">
        
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`card-${currentIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              
              {/* Question Area */}
              <div className="text-center mb-10 w-full">
                <span className="inline-block px-3 py-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-[10px] sm:text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-6 sm:mb-8 shadow-sm">
                  Question
                </span>
                <h1 className={`font-serif text-2xl sm:text-3xl md:text-5xl text-[#111827] leading-[1.3] tracking-tight transition-all duration-300 ${showAnswer ? 'opacity-40 scale-95' : 'opacity-100'}`}>
                  {currentCard.questionText}
                </h1>
              </div>

              {showAnswer ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="w-16 sm:w-24 h-px bg-[#E5E7EB] mb-10"></div>
                  
                  {/* Answer Area */}
                  <div className="text-center mb-16 w-full">
                    <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] sm:text-xs font-semibold text-blue-700 uppercase tracking-wider mb-6 shadow-sm">
                      Answer
                    </span>
                    <p className="text-lg sm:text-xl md:text-2xl text-[#4B5563] leading-relaxed max-w-2xl mx-auto font-serif">
                      {currentCard.answerText}
                    </p>
                  </div>

                  {/* Grading Interface */}
                  <div className="flex flex-col items-center w-full">
                    <p className="text-xs sm:text-sm font-medium text-[#6B7280] mb-4">Select your recall accuracy</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mx-auto">
                      <button 
                        onClick={handleGrade}
                        className="group flex flex-col items-center justify-center py-4 px-2 border border-[#E5E7EB] rounded-xl hover:bg-amber-50 hover:border-amber-200 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-200 relative"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-[#111827] group-hover:text-amber-900 mb-1">Hard</span>
                        <span className="text-[10px] sm:text-xs text-[#6B7280] group-hover:text-amber-700">Review in 1d</span>
                        <span className="absolute top-2 left-2 hidden md:flex items-center justify-center w-5 h-5 rounded border border-[#E5E7EB] bg-white text-[10px] font-mono text-[#9CA3AF] group-hover:border-amber-200 group-hover:text-amber-700">1</span>
                      </button>
                      
                      <button 
                        onClick={handleGrade}
                        className="group flex flex-col items-center justify-center py-4 px-2 border border-[#E5E7EB] rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 relative"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-[#111827] group-hover:text-blue-900 mb-1">Good</span>
                        <span className="text-[10px] sm:text-xs text-[#6B7280] group-hover:text-blue-700">Review in 3d</span>
                        <span className="absolute top-2 left-2 hidden md:flex items-center justify-center w-5 h-5 rounded border border-[#E5E7EB] bg-white text-[10px] font-mono text-[#9CA3AF] group-hover:border-blue-200 group-hover:text-blue-700">2</span>
                      </button>

                      <button 
                        onClick={handleGrade}
                        className="group flex flex-col items-center justify-center py-4 px-2 border border-[#E5E7EB] rounded-xl hover:bg-green-50 hover:border-green-200 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-200 relative"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-[#111827] group-hover:text-green-900 mb-1">Easy</span>
                        <span className="text-[10px] sm:text-xs text-[#6B7280] group-hover:text-green-700">Review in 7d</span>
                        <span className="absolute top-2 left-2 hidden md:flex items-center justify-center w-5 h-5 rounded border border-[#E5E7EB] bg-white text-[10px] font-mono text-[#9CA3AF] group-hover:border-green-200 group-hover:text-green-700">3</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex justify-center mt-12 sm:mt-24">
                  <button 
                    onClick={() => setShowAnswer(true)}
                    className="inline-flex items-center px-6 sm:px-8 py-3.5 sm:py-4 bg-[#111827] text-white text-sm font-medium rounded-xl hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111827]"
                  >
                    Show Answer
                    <span className="ml-3 px-2 py-0.5 bg-white/20 rounded border border-white/10 text-[10px] uppercase tracking-wider font-mono hidden sm:inline-block">Space</span>
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
