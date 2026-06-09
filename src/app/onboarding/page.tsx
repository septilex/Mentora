"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Target } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [goal, setGoal] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    
    // In the future: save goal to DB/State
    // For now, redirect to dashboard/upload
    router.push("/dashboard");
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 bg-black relative">
      
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#5E5CE6]/10 to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shadow-[0_0_30px_rgba(94,92,230,0.15)]">
            <Target className="w-8 h-8 text-[#5E5CE6]" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-white mb-3">
            What are you preparing for?
          </h1>
          <p className="text-[#8A8A8E] text-sm">
            Mentora adapts to your exact goal. Whether it's a specific exam or mastering a new topic.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5E5CE6] to-[#64D2FF] rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <input
              type="text"
              autoFocus
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Biology Midterm on Oct 14th"
              className="relative w-full bg-[#0A0A0A] border border-[rgba(255,255,255,0.1)] rounded-xl px-6 py-5 text-white placeholder-[#8A8A8E] focus:outline-none focus:ring-1 focus:ring-[#5E5CE6] transition-all text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={!goal.trim()}
            className="w-full flex items-center justify-center px-6 py-4 rounded-xl bg-[#EDEDED] text-black font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            Create Workspace
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </motion.div>
    </main>
  );
}
