import FeedbackForm from "@/components/FeedbackForm";

export default function App() {
  return (
    <>
      <header className="bg-surface/80 backdrop-blur-xl text-primary font-headline-md text-headline-md w-full top-0 sticky border-b border-black/5 shadow-sm z-50">
        <div className="flex items-center justify-between px-gutter py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4 active:scale-95 transition-transform">
            <img 
              src="/calicut-logo.png" 
              alt="University of Calicut" 
              className="h-12 w-auto object-contain" 
            />
          </div>
          <div className="flex flex-col items-end gap-1 active:scale-95 transition-transform">
            <img 
              src="/union-logo.png" 
              alt="Student Union" 
              className="h-10 w-auto object-contain" 
            />
            <div className="flex flex-col items-end text-primary leading-tight font-sans">
              <span className="text-[11px] font-bold tracking-wide">കാലിക്കറ്റ് സർവകലാശാല</span>
              <span className="text-[10px] font-medium opacity-90">വിദ്യാർത്ഥി യൂണിയൻ 2025</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 min-h-[calc(100vh-76px)] md:h-[calc(100vh-76px)] flex flex-col md:flex-row max-w-7xl mx-auto md:overflow-hidden">

        {/* Form Section - Centered on mobile, aligned on desktop */}
        <section className="flex-1 flex items-center justify-center p-4 md:p-6 md:w-2/3 md:h-full md:overflow-y-auto md:no-scrollbar">
          <div className="w-full max-w-lg md:max-w-none md:h-full">
            <FeedbackForm />
          </div>
        </section>
      </main>
    </>
  );
}
