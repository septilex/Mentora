"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowDown, FileText, LayoutList, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#111827] selection:bg-[#E5E7EB] selection:text-[#111827] flex flex-col">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between w-full gap-4 sm:gap-0">
        <div className="font-serif text-2xl font-semibold tracking-tight">
          Mentora.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors">
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium bg-[#111827] text-white px-5 py-2.5 rounded-full hover:bg-black transition-colors shadow-sm"
          >
            Open App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-8 pb-16 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-5xl md:text-7xl font-medium tracking-tight leading-[1.05] text-[#111827]"
          >
            Know exactly what <br />
            <span className="italic text-[#6B7280]">to study next.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-base md:text-lg text-[#6B7280] max-w-2xl mx-auto font-sans leading-relaxed px-4"
          >
            Drop your chaotic lecture notes and PDFs. Mentora instantly builds your daily active recall plan so you never have to cram again.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col items-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white transition-all duration-200 bg-[#111827] rounded-full hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111827] group shadow-md"
            >
              Build my study plan
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            
            {/* Credibility / Emotional Proof */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-sm text-[#6B7280]">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-center sm:text-left px-4 sm:px-0">"The only reason I passed Organic Chemistry." — Sarah M.</span>
            </div>
          </motion.div>
        </div>

        {/* The Transformation Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 max-w-4xl mx-auto relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            
            {/* Chaotic State (Left) */}
            <div className="bg-[#F9FAFB] rounded-xl p-8 border border-[#E5E7EB] h-[280px] sm:h-[320px] flex flex-col justify-center relative overflow-hidden shadow-sm">
              <div className="absolute -top-4 -left-4 w-24 sm:w-28 h-24 sm:h-28 bg-white rounded-lg border border-[#E5E7EB] shadow-sm rotate-[-12deg] flex items-center justify-center text-[#9CA3AF]">
                <FileText className="w-6 sm:w-8 h-6 sm:h-8 opacity-50" />
              </div>
              <div className="absolute top-16 right-4 w-28 sm:w-32 h-32 sm:h-40 bg-white rounded-lg border border-[#E5E7EB] shadow-sm rotate-[8deg] flex items-center justify-center text-[#9CA3AF]">
                <FileText className="w-6 sm:w-8 h-6 sm:h-8 opacity-50" />
              </div>
              <div className="absolute bottom-8 -right-6 w-32 sm:w-40 h-20 sm:h-24 bg-white rounded-lg border border-[#E5E7EB] shadow-sm rotate-[-4deg] flex items-center justify-center text-[#9CA3AF]">
                <span className="text-[10px] font-mono opacity-50 hidden sm:block">bio_lectures.pdf</span>
              </div>
              
              <div className="relative z-10 text-center bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-[#E5E7EB] mx-auto w-11/12 shadow-sm">
                <h3 className="font-medium text-[#111827] text-sm">Chaotic Notes</h3>
                <p className="text-xs text-[#6B7280] mt-1">14 unorganized PDFs.</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center text-[#D1D5DB] py-2 md:py-0">
              <ArrowRight className="w-6 h-6 hidden md:block" />
              <ArrowDown className="w-6 h-6 block md:hidden" />
            </div>

            {/* Mentora State (Right - Product Feel) */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] h-[280px] sm:h-[320px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center relative p-4 sm:p-6">
              
              <div className="w-full h-full bg-white rounded-lg border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-[#F3F4F6] flex justify-between items-center bg-[#F9FAFB]">
                  <p className="text-[10px] sm:text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Today's Focus</p>
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
                
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center">
                  <h4 className="font-serif text-base sm:text-lg text-[#111827] mb-3 sm:mb-4">Biology Midterm</h4>
                  
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 bg-[#F3F4F6] p-2.5 sm:p-3 rounded-md">
                    <div className="w-6 h-6 rounded-md bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm shrink-0">
                      <LayoutList className="w-3 h-3 text-[#111827]" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[#111827]">15 cards due today</p>
                  </div>
                  
                  <button className="w-full py-2.5 bg-[#111827] text-white text-xs sm:text-sm font-medium rounded-md hover:bg-black transition-colors shadow-sm mt-auto">
                    Begin Session
                  </button>
                </div>
              </div>
              
            </div>

          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-4xl mx-auto border-t border-[#E5E7EB] pt-12 sm:pt-16"
        >
          <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[#E5E7EB] shadow-sm mb-4">
              <FileText className="w-4 h-4 text-[#111827]" />
            </div>
            <h3 className="font-serif text-xl text-[#111827] mb-2">1. Drop anything</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs mx-auto sm:mx-0">
              Paste text, upload slides, or drag in massive PDFs. The engine parses it all seamlessly.
            </p>
          </div>
          <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[#E5E7EB] shadow-sm mb-4">
              <LayoutList className="w-4 h-4 text-[#111827]" />
            </div>
            <h3 className="font-serif text-xl text-[#111827] mb-2">2. Instant extraction</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs mx-auto sm:mx-0">
              Mentora reads your documents and pulls out the core concepts into bite-sized Q&A flashcards instantly.
            </p>
          </div>
          <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[#E5E7EB] shadow-sm mb-4">
              <ArrowRight className="w-4 h-4 text-[#111827]" />
            </div>
            <h3 className="font-serif text-xl text-[#111827] mb-2">3. Press start</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs mx-auto sm:mx-0">
              Log in every morning and clear your daily queue. No decision fatigue. Just purely effective active recall.
            </p>
          </div>
        </motion.div>
      </main>
      
      {/* Footer (Polished) */}
      <footer className="border-t border-[#E5E7EB] bg-[#F9FAFB] mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="text-center md:text-left">
            <div className="font-serif text-xl font-semibold tracking-tight text-[#111827] mb-2">
              Mentora.
            </div>
            <p className="text-xs text-[#6B7280]">The academic operating system.</p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-[#6B7280]">
            <Link href="#" className="hover:text-[#111827] transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-[#111827] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#111827] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
