import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
  return (
    <div className="{`dark ${'font-sans antialiased overflow-x-hidden selection:bg-brand selection:text-white'} w-full min-h-screen relative`}">
      {/* Film grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}
      ></div>
      {/*  BEGIN: Grain Overlay  */}

      {/*  END: Grain Overlay  */}
      {/*  BEGIN: Background Atmosphere  */}
      <div className="fixed inset-0 z-0 vignette"></div>
      <div className="fixed inset-0 z-[-1] flex items-center justify-center opacity-20">
        <img alt="Background Reference" className="w-full h-full object-cover blur-2xl" src="data:image/jpeg;base64,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" />
      </div>
      {/*  END: Background Atmosphere  */}
      {/*  BEGIN: Navigation  */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-brand font-black text-xl tracking-tighter" data-purpose="logo">
          ScopeAI
        </div>
        <div className="hidden md:flex space-x-8 text-xs uppercase tracking-widest text-gray-400">
          <a className="hover:text-brand transition-colors" href="#documentation">Documentation</a>
          <a className="hover:text-brand transition-colors" href="#architecture">Architecture</a>
          <a className="hover:text-brand transition-colors" href="#security">Security</a>
        </div>
      </nav>
      {/*  END: Navigation  */}
      {/*  BEGIN: Main Content  */}
      <div className="relative z-10 w-full">
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center px-4 pt-4">
        {/*  BEGIN: Hero Section  */}
        <section className="max-w-4xl mx-auto" data-purpose="hero-content">
          <div className="inline-block px-3 py-1 mb-6 border border-brand/30 bg-brand/5 text-[10px] uppercase tracking-[0.3em] text-brand rounded-custom">
            Llama 3.3 × Groq Powered
          </div>
          <h1 className="hero-title text-6xl md:text-8xl lg:text-9xl mb-8 text-white">
            THE <span className="text-brand">ScopeAI</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
            Deep-tissue GitHub repository analysis. Real-time code intelligence processed with Llama 3.3 70B via Groq's high-speed inference engine. You don't just search code; you interrogate it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/*  Call to Action  */}
            <button onClick={() => navigate('/ingestion')} className="glow-hover bg-brand text-brand-dark px-10 py-4 font-black uppercase tracking-widest text-sm rounded-custom transition-all active:scale-95" data-purpose="main-cta" id="cta-ingest">
              Ingest Repository
            </button>
            {/*  Secondary Action  */}
            <a className="text-gray-500 uppercase tracking-widest text-[10px] hover:text-white transition-colors border-b border-transparent hover:border-white pb-1" href="#how-it-works">
              How it works
            </a>
          </div>
        </section>
        {/*  END: Hero Section  */}
        {/*  BEGIN: Data Visualizer (Abstract)  */}
        <div className="mt-24 w-full max-w-5xl opacity-40 hover:opacity-100 transition-opacity duration-1000" data-purpose="canvas-container">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-brand/50 to-transparent"></div>
          <div className="flex justify-between py-2 text-[10px] font-mono text-brand uppercase tracking-tighter">
            <span>ingestion</span>
            <span>analysis</span>
            <span>query</span>
          </div>
        </div>
        {/*  END: Data Visualizer  */}
        </main>
        {/*  BEGIN: Content Sections  */}
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-32 py-32 text-left px-8 border-t border-brand/10 mt-32">
          <section id="how-it-works" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6"><span className="text-brand">01 //</span> HOW IT WORKS</h2>
            <p className="text-gray-400 leading-relaxed max-w-3xl md:text-lg">
              ScopeAI works by ingesting your entire GitHub repository and chunking the codebase using advanced AST (Abstract Syntax Tree) parsing. It then generates high-dimensional vector embeddings for each code snippet. When you query the system, it uses RAG (Retrieval-Augmented Generation) coupled with Llama 3.3 to fetch the most relevant context and generate precise, actionable insights.
            </p>
          </section>

          <section id="documentation" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6"><span className="text-brand">02 //</span> DOCUMENTATION</h2>
            <p className="text-gray-400 leading-relaxed max-w-3xl md:text-lg mb-6">
              Comprehensive guides to get you started with ScopeAI:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-4 md:text-lg">
              <li><strong className="text-white">Quick Start:</strong> Connect your GitHub account and ingest your first repo.</li>
              <li><strong className="text-white">Query Language:</strong> Learn how to ask complex architectural questions.</li>
              <li><strong className="text-white">API Reference:</strong> Integrate ScopeAI directly into your CI/CD pipelines.</li>
            </ul>
          </section>

          <section id="architecture" className="scroll-mt-32 w-full">
            <h2 className="text-3xl font-bold text-white mb-6"><span className="text-brand">03 //</span> ARCHITECTURE</h2>
            <p className="text-gray-400 leading-relaxed max-w-3xl md:text-lg">
              Built for speed and scale. The frontend is a high-performance React application styled with Tailwind CSS. Our backend is powered by FastAPI, featuring asynchronous processing for repository ingestion. The AI inference engine runs on Groq's LPU (Language Processing Unit), delivering unparalleled token generation speeds.
            </p>

            {/*  BEGIN: Flowchart  */}
            <div className="mt-16 w-full max-w-4xl bg-black/30 p-8 rounded-2xl border border-white/5 flex flex-col items-center relative font-sans">
              
              {/* Step 1 */}
              <div className="w-full bg-[#121212] text-white rounded-md p-5 text-center shadow-lg border border-[#3d3421] relative z-10 hover:border-[#b38a23] transition-colors">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b38a23]/30 text-xs font-mono hidden sm:block">1</div>
                <h3 className="font-bold text-lg mb-1 text-[#b38a23]">1 · Repository ingestion</h3>
                <p className="text-white/70 text-sm">Clone repo → parse .py with AST · parse .json / .yaml as text · repo deleted after parsing</p>
              </div>
              
              <svg className="w-6 h-6 text-[#3d3421] my-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>

              {/* Step 2 */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-[#121212] text-white rounded-md p-5 text-center shadow-lg border border-[#3d3421] relative hover:border-[#b38a23] transition-colors flex flex-col justify-center">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b38a23]/30 text-xs font-mono hidden sm:block">2</div>
                  <h3 className="font-bold text-md mb-1 text-[#b38a23]">AST analysis — .py files</h3>
                  <p className="text-white/70 text-xs">Imports · functions · classes · structure</p>
                </div>
                <div className="bg-[#121212] text-white rounded-md p-5 text-center shadow-lg border border-[#3d3421] relative hover:border-[#b38a23] transition-colors flex flex-col justify-center">
                  <h3 className="font-bold text-md mb-1 text-[#b38a23]">Text parsing — .json / .yaml</h3>
                  <p className="text-white/70 text-xs">Config context · key-value semantics</p>
                </div>
              </div>

              <svg className="w-6 h-6 text-[#3d3421] my-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>

              {/* Step 3 */}
              <div className="w-full bg-[#121212] text-white rounded-md p-5 text-center shadow-lg border border-[#3d3421] relative z-10 hover:border-[#b38a23] transition-colors">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b38a23]/30 text-xs font-mono hidden sm:block">3</div>
                <h3 className="font-bold text-lg mb-1 text-[#b38a23]">3 · Hybrid chunk strategy</h3>
                <p className="text-white/70 text-sm">Syntactic boundaries (imports · functions · classes) + max 500 tokens per chunk</p>
              </div>

              <svg className="w-6 h-6 text-[#3d3421] my-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>

              {/* Step 4 */}
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="bg-[#121212] text-white rounded-md p-5 text-center shadow-lg border border-[#3d3421] hover:border-[#b38a23] transition-colors relative flex flex-col justify-center">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b38a23]/30 text-xs font-mono hidden lg:block">4</div>
                  <h3 className="font-bold text-md mb-1 text-[#b38a23]">Import chunks</h3>
                  <p className="text-white/70 text-xs">Dependency context</p>
                </div>
                <div className="bg-[#121212] text-white rounded-md p-5 text-center shadow-lg border border-[#3d3421] hover:border-[#b38a23] transition-colors flex flex-col justify-center">
                  <h3 className="font-bold text-md mb-1 text-[#b38a23]">Function chunks</h3>
                  <p className="text-white/70 text-xs">Logic units</p>
                </div>
                <div className="bg-[#121212] text-white rounded-md p-5 text-center shadow-lg border border-[#3d3421] hover:border-[#b38a23] transition-colors flex flex-col justify-center">
                  <h3 className="font-bold text-md mb-1 text-[#b38a23]">Class chunks</h3>
                  <p className="text-white/70 text-xs">OOP structure</p>
                </div>
              </div>

              <svg className="w-6 h-6 text-[#3d3421] my-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>

              {/* Step 5 */}
              <div className="w-full bg-[#121212] text-white rounded-md p-5 text-center shadow-lg border border-[#3d3421] relative z-10 hover:border-[#b38a23] transition-colors">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b38a23]/30 text-xs font-mono hidden sm:block">5</div>
                <h3 className="font-bold text-lg mb-1 text-[#b38a23]">5 · Embedding — MiniLM-L6-v2</h3>
                <p className="text-white/70 text-sm">Each chunk → 384-dimension vector · model loaded once at service start, not per request</p>
              </div>

              <svg className="w-6 h-6 text-[#3d3421] my-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>

              {/* Step 6 */}
              <div className="w-full bg-[#121212] text-white rounded-md p-5 text-center shadow-lg border border-[#3d3421] relative z-10 hover:border-[#b38a23] transition-colors">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b38a23]/30 text-xs font-mono hidden sm:block">6</div>
                <h3 className="font-bold text-lg mb-1 text-[#b38a23]">6 · ChromaDB storage</h3>
                <p className="text-white/70 text-sm">token ID · 384-dim vector embedding<br/>metadata: file name · file type</p>
              </div>

              <svg className="w-6 h-6 text-[#3d3421] my-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>

              {/* Step 7 */}
              <div className="w-full bg-[#121212] text-white rounded-md p-5 text-center shadow-lg border border-[#3d3421] relative z-10 hover:border-[#b38a23] transition-colors">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b38a23]/30 text-xs font-mono hidden sm:block">7</div>
                <h3 className="font-bold text-lg mb-1 text-[#b38a23]">7 · Query — HNSW similarity search</h3>
                <p className="text-white/70 text-sm">Query embedded → HNSW graph traversal → nearest vectors returned</p>
              </div>

              <svg className="w-6 h-6 text-[#3d3421] my-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>

              {/* Step 8 */}
              <div className="w-full bg-[#121212] text-white rounded-md p-5 text-center shadow-lg border border-[#3d3421] relative z-10 hover:border-[#b38a23] transition-colors">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b38a23]/30 text-xs font-mono hidden sm:block">8</div>
                <h3 className="font-bold text-lg mb-1 text-[#b38a23]">8 · Retrieved context</h3>
                <p className="text-white/70 text-sm">Top-k semantically similar chunks surfaced · no raw files ever stored</p>
              </div>

            </div>
            {/*  END: Flowchart  */}

          </section>

          <section id="security" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6"><span className="text-brand">04 //</span> SECURITY</h2>
            <p className="text-gray-400 leading-relaxed max-w-3xl md:text-lg">
              Your code is your most valuable asset. ScopeAI employs enterprise-grade security protocols. Repositories are cloned ephemerally, processed in secure, isolated containers, and immediately purged after vector embeddings are generated. We do not use your proprietary code to train our foundation models.
            </p>
          </section>
        </div>
        {/*  END: Content Sections  */}
      </div>
      {/*  END: Main Content  */}
      {/*  BEGIN: Footer  */}
      <footer className="relative z-10 py-12 px-8 border-t border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-left">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Code Intelligence Infrastructure</p>
            <p className="text-xs text-gray-400">© 2024 thedarknight. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            {/*  Simple palette reference visualization  */}
            <div className="flex border border-white/10 p-1 rounded-custom">
              <div className="w-3 h-3 bg-[#0a0a0a]"></div>
              <div className="w-3 h-3 bg-[#1a1811]"></div>
              <div className="w-3 h-3 bg-[#3d3421]"></div>
              <div className="w-3 h-3 bg-[#7b4c2b]"></div>
              <div className="w-3 h-3 bg-[#b38a23]"></div>
            </div>
          </div>
        </div>
      </footer>
      {/*  END: Footer  */}
      {/*  JavaScript for minor interactivity  */}

    </div>
  );
}
