import React, { useEffect } from 'react';
import { useMidiStore } from '../../store/midiStore';
import { Cable, Activity } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { isConnected, selectedPortId, initialize } = useMidiStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
          WAVEBOX <span className="text-zinc-500 font-light">ARGOS</span>
        </h1>
        <div className="h-6 w-px bg-zinc-700 mx-2"></div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Cable className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-zinc-600'}`} />
          {isConnected ? (
            <span className="text-green-400 font-medium">{selectedPortId} Connected</span>
          ) : (
            <span>No MIDI Device Connected</span>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm transition-colors">
          <Activity className="w-4 h-4" />
          Monitor
        </button>
      </div>
    </div>
  );
};
