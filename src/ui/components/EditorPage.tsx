import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { useLibraryStore } from '../../store/libraryStore';
import { Knob } from './Knob';
import { SwitchSelect, ToggleSwitch } from './Controls';
import { Save, Copy, ChevronDown, X } from 'lucide-react';
import type { Preset } from '../../domain/types';

export const EditorPage = () => {
  const { currentPresetNumber, currentBank, parameters, isDirty, selectPreset, setParameter, markSaved } = useEditorStore();
  const { savePreset, initializeFactoryPresets } = useLibraryStore();

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveTarget, setSaveTarget] = useState({ number: currentPresetNumber, bank: currentBank, name: '' });

  // Initialize factory presets on load
  React.useEffect(() => {
    initializeFactoryPresets();
  }, [initializeFactoryPresets]);

  const handleBankChange = (bank: 'A' | 'B') => {
    selectPreset(currentPresetNumber, bank);
  };

  const formatDb = (val: number) => {
    return val > 0 ? `+${val}` : `${val}`;
  };

  const handleSaveClick = () => {
    // If it's a factory preset (1-10), force "Save As" modal pointing to slot 11 by default
    if (currentPresetNumber <= 10) {
      setSaveTarget({ number: 11, bank: currentBank, name: `My Preset ${currentBank}` });
      setIsSaveModalOpen(true);
    } else {
      // Normal save
      const newPreset: Preset = {
        id: `user-${currentPresetNumber}-${currentBank}`,
        number: currentPresetNumber,
        bank: currentBank,
        name: `User Preset ${currentPresetNumber}${currentBank}`,
        parameters: { ...parameters },
        isFactory: false,
      };
      savePreset(newPreset);
      markSaved();
      // Optional: show a toast here
    }
  };

  const handleSaveAsClick = () => {
    setSaveTarget({
      number: currentPresetNumber <= 10 ? 11 : currentPresetNumber,
      bank: currentBank,
      name: `My Preset ${currentBank}`
    });
    setIsSaveModalOpen(true);
  };

  const handleModalSave = () => {
    const newPreset: Preset = {
      id: `user-${saveTarget.number}-${saveTarget.bank}`,
      number: saveTarget.number,
      bank: saveTarget.bank,
      name: saveTarget.name || `User Preset ${saveTarget.number}${saveTarget.bank}`,
      parameters: { ...parameters },
      isFactory: false,
    };
    savePreset(newPreset);
    selectPreset(saveTarget.number, saveTarget.bank);
    markSaved();
    setIsSaveModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Save Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">Save Preset</h3>
              <button onClick={() => setIsSaveModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {currentPresetNumber <= 10 && (
                <div className="bg-yellow-900/20 border border-yellow-700/50 text-yellow-500 text-sm p-3 rounded-md mb-4">
                  Presets 1-10 are Factory defaults. Please select a slot between 11 and 40.
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Preset Name (Local)</label>
                <input
                  type="text"
                  value={saveTarget.name}
                  onChange={(e) => setSaveTarget({...saveTarget, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="My Custom Lead"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Slot</label>
                  <select
                    value={saveTarget.number}
                    onChange={(e) => setSaveTarget({...saveTarget, number: Number(e.target.value)})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {Array.from({ length: 30 }, (_, i) => i + 11).map(num => (
                      <option key={num} value={num}>Slot {num}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Bank</label>
                  <div className="flex bg-zinc-950 border border-zinc-700 rounded">
                    <button
                      className={`flex-1 py-2 font-bold transition-colors ${saveTarget.bank === 'A' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}
                      onClick={() => setSaveTarget({...saveTarget, bank: 'A'})}
                    >A</button>
                    <button
                      className={`flex-1 py-2 font-bold transition-colors border-l border-zinc-700 ${saveTarget.bank === 'B' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}
                      onClick={() => setSaveTarget({...saveTarget, bank: 'B'})}
                    >B</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-zinc-800 bg-zinc-950">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSave}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header section with Preset selection */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex items-center gap-6">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Preset</label>
            <div className="flex border border-zinc-700 rounded-md bg-zinc-950 overflow-hidden">
              <select
                value={currentPresetNumber}
                onChange={(e) => selectPreset(Number(e.target.value), currentBank)}
                className="bg-transparent text-white px-4 py-2 outline-none appearance-none min-w-[120px] font-mono font-bold text-lg cursor-pointer"
              >
                {Array.from({ length: 40 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num} className="bg-zinc-900">
                    {num < 10 ? `0${num}` : num} {num <= 10 ? '(Factory)' : ''}
                  </option>
                ))}
              </select>
              <div className="px-3 border-l border-zinc-700 bg-zinc-900 flex items-center justify-center pointer-events-none">
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Bank</label>
            <div className="flex bg-zinc-950 border border-zinc-700 rounded-md p-1">
              <button
                className={`px-6 py-1.5 font-bold rounded transition-colors ${
                  currentBank === 'A' ? 'bg-blue-600 text-white shadow' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
                onClick={() => handleBankChange('A')}
              >
                A
              </button>
              <button
                className={`px-6 py-1.5 font-bold rounded transition-colors ${
                  currentBank === 'B' ? 'bg-blue-600 text-white shadow' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
                onClick={() => handleBankChange('B')}
              >
                B
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isDirty && <span className="text-yellow-500 text-sm font-medium animate-pulse">Unsaved changes</span>}
          <button
            onClick={handleSaveAsClick}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-sm font-medium transition-colors border border-zinc-700"
          >
            <Copy className="w-4 h-4" /> Save As
          </button>
          <button
            onClick={handleSaveClick}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md text-sm font-medium shadow-lg transition-colors"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      {/* Editor Main Board */}
      <div className="bg-[#1a1a1a] border-4 border-[#222] rounded-xl shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] pointer-events-none"></div>

        <div className="p-8 md:p-12 relative z-10">

          <div className="flex flex-wrap justify-between gap-6 mb-16 px-4">
            <Knob
              label="Level"
              value={parameters.level}
              min={0} max={100} unit="%"
              onChange={(val) => setParameter('level', val)}
            />
            <Knob
              label="Drive"
              value={parameters.drive}
              min={0} max={100} unit="%"
              onChange={(val) => setParameter('drive', val)}
            />
            <div className="w-px bg-zinc-800 mx-2 hidden md:block"></div>
            <Knob
              label="Treble"
              value={parameters.treble}
              min={-12} max={12} unit="dB"
              formatValue={formatDb}
              onChange={(val) => setParameter('treble', val)}
            />
            <Knob
              label="Sweep"
              value={parameters.sweep}
              min={400} max={3700} unit="Hz"
              onChange={(val) => setParameter('sweep', val)}
            />
            <Knob
              label="Middle"
              value={parameters.middle}
              min={-10} max={10} unit="dB"
              formatValue={formatDb}
              onChange={(val) => setParameter('middle', val)}
            />
            <Knob
              label="Bass"
              value={parameters.bass}
              min={-15} max={15} unit="dB"
              formatValue={formatDb}
              onChange={(val) => setParameter('bass', val)}
            />
          </div>

          <hr className="border-zinc-800 mb-12 shadow-sm" />

          <div className="flex flex-wrap items-end justify-between gap-12 px-4">
            <div className="flex-1 min-w-[200px] space-y-6">
              <SwitchSelect
                label="Amplifier Model"
                value={parameters.amp}
                options={['Fender', 'Marshall', 'MesaBoogie']}
                onChange={(val) => setParameter('amp', val)}
              />
              <SwitchSelect
                label="Gain Mode"
                value={parameters.gain}
                options={['Baixo', 'Alto', 'Tube']}
                onChange={(val) => setParameter('gain', val)}
              />
              <SwitchSelect
                label="Mic Position"
                value={parameters.mic}
                options={['Borda', 'Centro', 'Distante']}
                onChange={(val) => setParameter('mic', val)}
              />
            </div>

            <div className="flex items-center justify-end gap-16 flex-1 min-w-[200px]">
              <ToggleSwitch
                label="Switch"
                value={parameters.switch}
                options={['Ligado', 'Desligado']}
                onChange={(val) => setParameter('switch', val)}
              />
              <ToggleSwitch
                label="Bypass"
                value={parameters.bypass}
                options={['Ligado', 'Desligado']}
                onChange={(val) => setParameter('bypass', val)}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
