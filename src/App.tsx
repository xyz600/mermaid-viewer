import { useState, useEffect, useRef } from 'react'
import mermaid from 'mermaid'

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

function App() {
  const [code, setCode] = useState<string>(`graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`);
  const [svgOutput, setSvgOutput] = useState<string>('');
  const mermaidRef = useRef<HTMLDivElement>(null);

  // Render mermaid diagram when code changes
  useEffect(() => {
    const renderDiagram = async () => {
      if (mermaidRef.current) {
        try {
          mermaidRef.current.innerHTML = '';
          const { svg } = await mermaid.render('mermaid-diagram', code);
          setSvgOutput(svg);
        } catch (error) {
          console.error('Failed to render mermaid diagram:', error);
          setSvgOutput('<div class="text-red-500 p-4">Error rendering diagram</div>');
        }
      }
    };

    renderDiagram();
  }, [code]);

  // Generate line numbers for the editor
  const lineNumbers = code.split('\n').map((_, index) => index + 1);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold">Mermaid Viewer</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="bg-slate-200 dark:bg-slate-700 px-4 py-2 border-b border-slate-300 dark:border-slate-600">
              <h2 className="font-medium text-lg">Editor</h2>
            </div>
            <div className="flex">
              {/* Line Numbers */}
              <div className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 py-3 px-2 text-right select-none font-mono border-r border-slate-200 dark:border-slate-600 w-12">
                {lineNumbers.map(num => (
                  <div key={num} className="leading-6">{num}</div>
                ))}
              </div>
              {/* Text Editor */}
              <textarea
                className="w-full p-3 font-mono bg-white dark:bg-slate-800 border-none resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none leading-6"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={Math.max(10, lineNumbers.length)}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="bg-slate-200 dark:bg-slate-700 px-4 py-2 border-b border-slate-300 dark:border-slate-600">
              <h2 className="font-medium text-lg">Preview</h2>
            </div>
            <div className="p-4 overflow-auto min-h-[300px] flex items-center justify-center">
              <div ref={mermaidRef} className="hidden"></div>
              <div dangerouslySetInnerHTML={{ __html: svgOutput }} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-200 dark:bg-slate-800 py-4 text-center text-slate-600 dark:text-slate-400 text-sm border-t border-slate-300 dark:border-slate-700">
        <p>Mermaid Viewer - A tool for creating and visualizing diagrams</p>
      </footer>
    </div>
  )
}

export default App
