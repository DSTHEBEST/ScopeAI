import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

type ChatSession = {
  id: string;
  title: string;
  chatLog: { sender: string; text: string }[];
  codeChunks: { id: string; code: string }[];
};

export default function Analysis() {

  const location = useLocation();
  const files: string[] = location.state?.files || [];

  // Terminal commands state
  const [inputVal, setInputVal] = useState('');
  
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 'default', title: 'New Chat', chatLog: [], codeChunks: [] }
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('default');

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const chatLog = activeSession.chatLog;
  const codeChunks = activeSession.codeChunks;

  const setChatLog = (updater: { sender: string; text: string }[] | ((prev: { sender: string; text: string }[]) => { sender: string; text: string }[])) => {
    setSessions((prev: ChatSession[]) => prev.map(s => s.id === activeSessionId ? { 
      ...s, 
      chatLog: typeof updater === 'function' ? updater(s.chatLog) : updater,
      title: s.title === 'New Chat' && typeof updater === 'function' && updater(s.chatLog)[0]?.text 
        ? updater(s.chatLog)[0].text.slice(0, 15) + (updater(s.chatLog)[0].text.length > 15 ? '...' : '') 
        : s.title
    } : s));
  };

  const setCodeChunks = (updater: { id: string; code: string }[] | ((prev: { id: string; code: string }[]) => { id: string; code: string }[])) => {
    setSessions((prev: ChatSession[]) => prev.map(s => s.id === activeSessionId ? { ...s, codeChunks: typeof updater === 'function' ? updater(s.codeChunks) : updater } : s));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [visibleFilesCount, setVisibleFilesCount] = useState(8);

  // Resizable sidebar state
  const [leftWidth, setLeftWidth] = useState(288);
  const [rightWidth, setRightWidth] = useState(384);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        setLeftWidth(Math.max(200, Math.min(e.clientX, 600)));
      }
      if (isResizingRight) {
        setRightWidth(Math.max(250, Math.min(window.innerWidth - e.clientX, 800)));
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isLoading]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const query = inputVal.trim();
    setChatLog(prev => [...prev, { sender: 'user', text: query }]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/search-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      setChatLog(prev => [...prev, { sender: 'ai', text: data.explanation }]);

      if (data.context_used && data.context_used.length > 0) {
        setCodeChunks(data.context_used.map((code: string) => ({
          id: `0x${Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0')}`,
          code: code
        })));
      }

    } catch (error) {
      setChatLog(prev => [...prev, { sender: 'ai', text: `[SYSTEM ERROR]: Failed to reach INTEL-ENGINE. ${error instanceof Error ? error.message : String(error)}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e5e3] font-sans flex flex-col relative overflow-hidden">

      {/* Header */}
      <header className="h-16 border-b border-[#3d3421] flex items-center justify-between px-6 shrink-0 bg-[#0a0a0a] z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#b38a23] text-[#121212] font-bold flex items-center justify-center rounded-sm text-sm">
            DS
          </div>
          <h1 className="text-xl font-bold tracking-wider text-[#b38a23]">DATASTORE SNAPSHOT</h1>
        </div>
        <div className="flex items-center gap-4 text-[#b38a23] text-xs">
          <div className="w-8 h-8 rounded-full border border-[#b38a23] opacity-80 bg-[#3d3421] flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[#b38a23]/40 to-transparent"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden z-10 relative">

        {/* Left Sidebar - File Explorer */}
        <aside style={{ width: leftWidth }} className="border-r border-[#3d3421] flex flex-col bg-[#0a0a0a] shrink-0 relative">
          <div
            onMouseDown={() => setIsResizingLeft(true)}
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#b38a23]/50 z-20"
          ></div>
          <div className="p-4 border-b border-[#3d3421] flex items-center justify-between text-[#b38a23] text-sm font-bold tracking-wider">
            <span>FILE EXPLORER</span>
          </div>
          <div className="p-4 flex flex-col gap-4 overflow-y-auto hidden-scrollbar">
            {files.length > 0 ? (
              <>
                {files.slice(0, visibleFilesCount).map((file, i) => (
                  <div key={file} className="bg-[#1a1a1a] rounded-sm p-3 border border-[#3d3421] shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-4 bg-[#b38a23] rounded-sm opacity-80 shrink-0"></div>
                      <span className="text-[#b38a23] font-bold text-sm truncate" title={file}>{file.split('/').pop()}</span>
                    </div>
                    <p className="text-[10px] text-[#9ca3af] truncate">{file}</p>
                  </div>
                ))}
                {visibleFilesCount < files.length && (
                  <button
                    onClick={() => setVisibleFilesCount(prev => prev + 10)}
                    className="mt-2 py-2 border border-[#3d3421] text-[#b38a23] text-xs hover:bg-[#1a1a1a] transition-colors rounded-sm uppercase tracking-widest shrink-0"
                  >
                    See More ({files.length - visibleFilesCount})
                  </button>
                )}
              </>
            ) : (
              <div className="text-xs text-[#9ca3af] italic opacity-50">No files indexed...</div>
            )}
          </div>
        </aside>

        {/* Center - Chat/Interrogation */}
        <section className="flex-1 flex flex-col bg-[#242424] relative">
          {/* Top Bar */}
          <div className="h-14 border-b border-[#3d3421] flex items-center justify-between px-6 shrink-0 bg-[#121212] gap-4">
            <div className="flex items-center gap-4 flex-1 overflow-x-auto hidden-scrollbar">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[#9ca3af] text-xs font-bold shrink-0">LLAMA-3.3</span>
              </div>
              <div className="h-4 w-px bg-[#3d3421] shrink-0"></div>
              <div className="flex items-center gap-1.5 flex-nowrap">
                {sessions.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => setActiveSessionId(s.id)}
                    className={`px-3 py-1 flex items-center gap-1.5 text-xs rounded-sm transition-opacity shrink-0 ${
                      s.id === activeSessionId 
                        ? 'bg-[#0a0a0a] text-[#b38a23] font-bold border border-[#b38a23]' 
                        : 'text-[#9ca3af] hover:text-white border border-[#3d3421] bg-[#0a0a0a]'
                    }`}
                  >
                    <span className="truncate max-w-[100px]">{s.title}</span>
                    {sessions.length > 1 && (
                      <span 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          const nextSessions = sessions.filter(p => p.id !== s.id);
                          setSessions(nextSessions); 
                          if (s.id === activeSessionId && nextSessions.length > 0) {
                            setActiveSessionId(nextSessions[0].id);
                          }
                        }}
                        className="text-sm hover:text-red-500 cursor-pointer ml-1"
                      >×</span>
                    )}
                  </button>
                ))}
                <button
                  onClick={() => { const id = Date.now().toString(); setSessions(prev => [...prev, { id, title: 'New Chat', chatLog: [], codeChunks: [] }]); setActiveSessionId(id); }}
                  className="px-2 py-1 flex items-center justify-center text-[#9ca3af] hover:text-white border border-[#3d3421] hover:border-[#b38a23] bg-[#0a0a0a] rounded-sm transition-colors shrink-0"
                  title="Start New Chat"
                >
                  <span className="text-sm leading-none">+</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setChatLog([]); setCodeChunks([]); }} className="px-3 py-1 border border-[#3d3421] text-[#b38a23] text-xs hover:border-[#b38a23] transition-colors rounded-sm uppercase">
                Reset Session
              </button>
            </div>
          </div>

          {/* Chat Flow */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 hidden-scrollbar">
            {chatLog.map((msg, i) => (
              <div key={i} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'user' ? (
                  <div className="flex gap-4 max-w-2xl items-start">
                    <div className="border border-[#b38a23]/40 text-[#b38a23] p-4 text-sm leading-relaxed rounded-sm font-sans bg-[#1a1a1a]/30">
                      <ReactMarkdown
                        components={{
                          h1: ({ ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
                          h2: ({ ...props }) => <h2 className="text-lg font-bold mb-2" {...props} />,
                          p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          code: ({ inline, ...props }: { inline?: boolean, [key: string]: any }) => inline 
                            ? <code className="bg-[#1a1a1a] px-1 py-0.5 rounded text-[#b38a23] font-mono text-xs" {...props} /> 
                            : <pre className="block bg-[#1a1a1a] p-3 rounded border border-[#3d3421] my-2 overflow-x-auto"><code className="text-xs font-mono whitespace-pre-wrap" {...props} /></pre>
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                    <div className="w-10 h-10 bg-[#b38a23] text-[#121212] flex items-center justify-center rounded-sm font-bold text-xs shrink-0 mt-1">
                      YOU
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 max-w-2xl items-start">
                    <div className="w-10 h-10 border border-[#b38a23]/40 text-[#b38a23] flex items-center justify-center rounded-sm text-lg shrink-0 mt-1 bg-[#1a1a1a]/50">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    </div>
                    <div className="bg-[#121212] text-[#e0e5e3] p-4 text-sm leading-relaxed rounded-sm font-sans border border-[#3d3421] w-full">
                      <ReactMarkdown 
                        components={{
                          h1: ({ ...props }) => <h1 className="text-xl font-bold text-white mb-2" {...props} />,
                          h2: ({ ...props }) => <h2 className="text-lg font-bold text-white mb-2" {...props} />,
                          h3: ({ ...props }) => <h3 className="text-md font-bold text-[#b38a23] mb-1" {...props} />,
                          p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({ ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                          ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                          li: ({ ...props }) => <li className="text-[#e0e5e3]" {...props} />,
                          hr: ({ ...props }) => <hr className="border-[#3d3421] my-3" {...props} />,
                          code: ({ inline, ...props }: { inline?: boolean, [key: string]: any }) => inline 
                            ? <code className="bg-[#1a1a1a] px-1 py-0.5 rounded text-[#b38a23] font-mono text-xs" {...props} /> 
                            : <pre className="block bg-[#1a1a1a] p-3 rounded border border-[#3d3421] my-2 overflow-x-auto"><code className="text-xs font-mono text-[#e0e5e3] whitespace-pre-wrap" {...props} /></pre>
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex w-full justify-start">
                <div className="flex gap-4 max-w-2xl items-start animate-pulse">
                  <div className="w-10 h-10 border border-[#b38a23]/40 text-[#b38a23] flex items-center justify-center rounded-sm text-lg shrink-0 mt-1 bg-[#1a1a1a]/50">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <div className="bg-[#121212] text-[#b38a23]/70 p-4 text-sm leading-relaxed rounded-sm font-sans border border-[#3d3421] tracking-widest">
                    ANALYZING VECTORS...
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input Bar */}
          <div className="p-6 bg-[#121212] border-t border-[#3d3421]">
            <form onSubmit={handleCommand} className="relative">
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Enter command or query..."
                className="w-full bg-[#242424] border border-[#b38a23]/50 focus:border-[#b38a23] rounded-sm px-4 py-4 pr-12 text-[#b38a23] placeholder-[#b38a23]/30 outline-none transition-colors"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b38a23] hover:text-white transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </section>

        {/* Right Sidebar - Code & Palette */}
        <aside style={{ width: rightWidth }} className="border-l border-[#3d3421] flex flex-col bg-[#121212] shrink-0 relative">
          <div
            onMouseDown={() => setIsResizingRight(true)}
            className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#b38a23]/50 z-20"
          ></div>
          <div className="p-4 border-b border-[#3d3421] text-[#b38a23] text-sm font-bold tracking-wider flex items-center gap-2">
            <span>&lt;/&gt;</span>
            <span>RETRIEVED CODE CHUNKS</span>
          </div>

          <div className="p-4 flex flex-col gap-6 overflow-y-auto flex-1 hidden-scrollbar">
            {codeChunks.map((chunk, i) => (
              <div key={i} className="border border-[#3d3421] rounded-sm overflow-hidden shrink-0">
                <div className="bg-[#1a1a1a] px-3 py-2 flex items-center justify-between border-b border-[#3d3421]">
                  <span className="text-xs text-[#b38a23]">CHUNK_ID: {chunk.id}</span>
                  <span className="text-[10px] text-[#9ca3af] cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(chunk.code)}>COPY</span>
                </div>
                <div className="p-3 bg-[#242424] text-xs overflow-x-auto hidden-scrollbar">
                  <pre className="text-[#b38a23] whitespace-pre-wrap">
                    <code>{chunk.code}</code>
                  </pre>
                </div>
              </div>
            ))}

            {/* Palette Analysis */}
            <div className="mt-8">
              <h3 className="text-xs text-[#9ca3af] font-bold mb-3 uppercase">System Palette Analysis</h3>
              <div className="flex h-6 w-full rounded-sm overflow-hidden border border-[#3d3421]">
                <div className="flex-1 bg-[#121212]"></div>
                <div className="flex-1 bg-[#3d3421]"></div>
                <div className="flex-1 bg-[#373f27]"></div>
                <div className="flex-1 bg-[#8c6543]"></div>
                <div className="flex-1 bg-[#b38a23]"></div>
              </div>
            </div>
          </div>
        </aside>

      </main>

      {/* Solid Yellow Footer */}
      <footer className="h-2 bg-[#b38a23] flex items-center justify-between px-6 shrink-0 z-20 relative border-t border-[#3d3421]">
      </footer>
    </div>
  );
}
