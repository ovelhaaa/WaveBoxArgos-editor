import { useState } from 'react';
import { TopBar } from './ui/components/TopBar';
import { MidiConnectionPage } from './ui/components/MidiConnectionPage';
import { EditorPage } from './ui/components/EditorPage';
import { MidiMonitor } from './ui/components/MidiMonitor';


function App() {

  const [activeTab, setActiveTab] = useState<'connect' | 'editor' | 'monitor'>('connect');

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">
      <TopBar />

      <div className="flex-1 overflow-auto">
        <div className="flex gap-4 p-4 border-b border-zinc-800 bg-zinc-900/50">
          <button
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'connect' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            onClick={() => setActiveTab('connect')}
          >
            Connection
          </button>

          <button
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'editor' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </button>

          <button
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'monitor' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            onClick={() => setActiveTab('monitor')}
          >
            Monitor
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'connect' && <MidiConnectionPage />}
          {activeTab === 'editor' && <EditorPage />}
          {activeTab === 'monitor' && (
            <div className="max-w-4xl mx-auto py-8">
              <h2 className="text-3xl font-light text-white mb-8 border-b border-zinc-800 pb-4">MIDI Monitor</h2>
              <MidiMonitor />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
