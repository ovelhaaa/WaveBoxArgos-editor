
import { useMidiStore } from '../../store/midiStore';
import { Cable, Unplug } from 'lucide-react';

export const MidiConnectionPage = () => {
  const { isSupported, outputs, connectPort, disconnectPort, selectedPortId } = useMidiStore();

  if (!isSupported) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">Web MIDI API Not Supported</h2>
        <p>Your browser does not support the Web MIDI API. Please try Google Chrome or Microsoft Edge.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-light text-white mb-8 border-b border-zinc-800 pb-4 flex items-center gap-3">
        <Cable className="text-blue-500" /> MIDI Connection
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Output Ports (Connecting to Pedal) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-xl font-medium text-white mb-4 flex items-center justify-between">
            Available Devices
            <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded-full">{outputs.length} outputs</span>
          </h3>

          {outputs.length === 0 ? (
            <div className="text-zinc-500 py-8 text-center bg-zinc-950 rounded border border-zinc-800/50 border-dashed">
              No MIDI devices found. <br /> Ensure your Argos pedal is connected and turned on.
            </div>
          ) : (
            <div className="space-y-3">
              {outputs.map((output) => {
                const isSelected = selectedPortId === output.id;
                return (
                  <div
                    key={output.id}
                    className={`flex items-center justify-between p-4 rounded border transition-colors ${
                      isSelected ? 'bg-blue-900/20 border-blue-500/50' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <p className={`font-medium ${isSelected ? 'text-blue-400' : 'text-zinc-300'}`}>
                        {output.name || 'Unknown Device'}
                      </p>
                      <p className="text-xs text-zinc-600 font-mono mt-1">ID: {output.id}</p>
                    </div>
                    {isSelected ? (
                      <button
                        onClick={() => disconnectPort()}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-sm flex items-center gap-2 transition-colors"
                      >
                        <Unplug className="w-4 h-4" /> Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => connectPort(output.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm transition-colors"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Connection Instructions */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-6 text-zinc-400 text-sm leading-relaxed space-y-4">
          <h3 className="text-white font-medium text-lg mb-2">How to connect</h3>
          <p>
            1. Connect the Wavebox Argos pedal to your computer using a MIDI-to-USB interface. <br />
            2. The pedal should appear in the list on the left. <br />
            3. Click &quot;Connect&quot; on the output corresponding to your pedal.
          </p>
          <div className="mt-6 p-4 bg-yellow-900/10 border border-yellow-700/30 rounded text-yellow-500/80">
            <strong>Note on V1 limitations:</strong> <br/>
            The hardware SysEx protocol for dumping the full preset state is not fully documented.
            Currently, the editor works as a one-way controller (sending parameter changes and preset selections) and a local preset librarian.
            Two-way sync will be available once the full dump protocol is mapped.
          </div>
        </div>
      </div>
    </div>
  );
};
