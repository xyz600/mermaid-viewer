import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl w-full mx-auto p-8">
        <div className="flex justify-center space-x-8 mb-8">
          <a href="https://vite.dev" target="_blank" className="group">
            <img 
              src={viteLogo} 
              className="h-24 p-6 transition-all duration-300 group-hover:drop-shadow-[0_0_2em_#646cffaa]" 
              alt="Vite logo" 
            />
          </a>
          <a href="https://react.dev" target="_blank" className="group">
            <img 
              src={reactLogo} 
              className="h-24 p-6 transition-all duration-300 animate-[spin_20s_linear_infinite] group-hover:drop-shadow-[0_0_2em_#61dafbaa]" 
              alt="React logo" 
            />
          </a>
        </div>
        <h1 className="text-5xl font-bold text-center mb-8">Vite + React</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 mb-4"
          >
            count is {count}
          </button>
          <p className="text-lg">
            Edit <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
