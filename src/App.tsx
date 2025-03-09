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
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Mermaid Viewer</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4 max-w-7xl mx-auto w-full">
        {/* Editor Section */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-2 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
            <h2 className="font-medium">Editor</h2>
          </div>
          <div className="flex">
            {/* Line Numbers */}
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 p-2 text-right select-none">
              {lineNumbers.map(num => (
                <div key={num} className="pr-2">{num}</div>
              ))}
            </div>
            {/* Text Editor */}
            <textarea
              className="w-full p-2 font-mono bg-white dark:bg-gray-800 border-none resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={Math.max(10, lineNumbers.length)}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-2 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
            <h2 className="font-medium">Preview</h2>
          </div>
          <div className="p-4 overflow-auto">
            <div ref={mermaidRef} className="hidden"></div>
            <div dangerouslySetInnerHTML={{ __html: svgOutput }} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-gray-800 p-4 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>Mermaid Viewer - A tool for creating and visualizing diagrams</p>
      </footer>
    </div>
  )
}

export default App
