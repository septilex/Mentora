"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, BookOpen, Clock, FileText, CheckCircle2, AlertCircle, Flame, UploadCloud, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);

  const fetchMaterials = async () => {
    try {
      const res = await fetch("/api/materials");
      if (res.ok) {
        const data = await res.json();
        if (data.materials) setMaterials(data.materials);
      }
    } catch (err) {
      console.error("Failed to fetch materials", err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Mock login for MVP slice (creates user "prajit")
      // In a real app, this happens at /login
      await signIn("credentials", {
        email: 'prajit@mentora.edu',
        password: 'password',
        redirect: false
      });

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        await fetchMaterials();
        alert(`Extracted ${data.flashcards?.length} flashcards successfully! (You can click OK to continue)`);
        // We comment out redirection to stay on the dashboard and verify chunks
        // router.push(`/study?materialId=${data.materialId}`);
      } else {
        alert("Extraction failed: " + data.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8 md:py-16 w-full">
      
      {/* Top Header */}
      <header className="mb-10 md:mb-14">
        <div className="flex items-center gap-2 mb-3 text-xs md:text-sm font-medium text-amber-700 bg-amber-50 inline-flex px-3 py-1.5 rounded-md border border-amber-200 shadow-sm">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          3-day study streak
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-medium text-[#111827] tracking-tight">
          Good evening, Prajit.
        </h1>
        <p className="text-base md:text-lg text-[#6B7280] mt-4 font-sans max-w-2xl leading-relaxed">
          Upload a new lecture PDF below, and Mentora will immediately extract the core concepts into a focused study session.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        
        {/* Left Column: Immediate Action & Plan (7 columns wide) */}
        <div className="lg:col-span-7 space-y-8 md:space-y-12">
          
          {/* Main Action Card (Upload Box) */}
          <section>
            <div className="bg-white rounded-2xl p-8 md:p-12 border-2 border-dashed border-[#E5E7EB] hover:border-[#111827] transition-colors relative flex flex-col items-center justify-center text-center group cursor-pointer">
              <input 
                type="file" 
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              
              {isUploading ? (
                <>
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                  <h3 className="font-serif text-xl font-medium text-[#111827] mb-2">Analyzing PDF...</h3>
                  <p className="text-[#6B7280] text-sm">Mentora is extracting flashcards via Gemini AI.</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#F9FAFB] rounded-full flex items-center justify-center border border-[#E5E7EB] mb-6 group-hover:scale-105 transition-transform shadow-sm">
                    <UploadCloud className="w-8 h-8 text-[#111827]" />
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#111827] mb-2">Upload Lecture PDF</h3>
                  <p className="text-[#6B7280] max-w-sm text-sm">
                    Drag and drop your syllabus or lecture notes here. We'll generate 5 flashcards instantly.
                  </p>
                  <button className="mt-6 px-6 py-2.5 bg-[#111827] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm">
                    Select File
                  </button>
                </>
              )}
            </div>
          </section>

          {/* Uploaded Documents List */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b border-[#E5E7EB] pb-4">
              <h3 className="font-serif text-xl md:text-2xl font-medium text-[#111827]">Ingested Documents</h3>
            </div>
            
            <div className="space-y-3">
              {materials.length === 0 ? (
                <div className="flex items-start gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white shadow-sm opacity-50">
                  <div className="w-10 h-10 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-[#111827]" />
                  </div>
                  <div className="flex-1 pr-2">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-[#111827] text-sm md:text-base">No documents yet</h4>
                    </div>
                    <p className="text-xs md:text-sm text-[#6B7280]">Upload a PDF to start building your knowledge base.</p>
                  </div>
                </div>
              ) : (
                materials.map((mat) => (
                  <div key={mat.id} className="flex items-start gap-4 p-4 rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5 text-[#111827]" />
                    </div>
                    <div className="flex-1 pr-2">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-[#111827] text-sm md:text-base">{mat.title}</h4>
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                          {mat._count?.chunks || 0} chunks
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-[#6B7280]">Status: {mat.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Analytics & Stats (5 columns wide) */}
        <div className="lg:col-span-5 space-y-8 md:space-y-12 opacity-50 pointer-events-none">
          {/* Readiness Overview */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b border-[#E5E7EB] pb-4">
              <h3 className="font-serif text-xl md:text-2xl font-medium text-[#111827]">Exam Readiness</h3>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] space-y-6 shadow-sm">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-[#111827]">Waiting for data...</span>
                </div>
                <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
