import React from 'react';
import { useMidiStore } from '../../store/midiStore';
import { Terminal, Trash2 } from 'lucide-react';

export const MidiMonitor: React.FC = () => {
  const { midiLogs, clearLogs, isConnected } = useMidiStore();

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 h-96 flex flex-col font-mono text-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
        <h3 className="text-zinc-400 font-medium flex items-center gap-2">
          <Terminal className="w-4 h-4" /> MIDI Activity Monitor
        </h3>
        <button
          onClick={clearLogs}
          className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400 transition-colors"
          title="Clear Logs"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {!isConnected && (
          <p className="text-zinc-600 text-center py-8 italic">Waiting for connection...</p>
        )}
        {isConnected && midiLogs.length === 0 && (
          <p className="text-zinc-600 text-center py-8 italic">No MIDI activity</p>
        )}
        {midiLogs.map((log, idx) => (
          <div key={`${log.timestamp}-${idx}`} className="flex items-center gap-3 text-xs py-1 px-2 hover:bg-zinc-900 rounded">
            <span className="text-zinc-600 w-24">{(log.timestamp % 100000).toFixed(0)}</span>
            <span className={`w-16 font-semibold ${
              log.type === 'cc' ? 'text-blue-400' :
              log.type === 'pc' ? 'text-green-400' :
              log.type === 'sysex' ? 'text-purple-400' :
              'text-zinc-400'
            }`}>
              {log.type.toUpperCase()}
            </span>
            <span className="text-zinc-500 w-12">Ch {log.channel + 1}</span>
            <span className="text-zinc-300">[{log.data.map(d => d.toString(16).padStart(2, '0').toUpperCase()).join(' ')}]</span>
          </div>
        ))}
      </div>
    </div>
  );
};
