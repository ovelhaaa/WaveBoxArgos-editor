import React from 'react';

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export const SwitchSelect: React.FC<SelectProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</label>
      <div className="flex bg-zinc-900 border border-zinc-800 rounded p-1 shadow-inner">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 py-1.5 px-3 text-xs font-medium rounded transition-colors ${
              value === opt
                ? 'bg-blue-600 text-white shadow'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export const ToggleSwitch: React.FC<SelectProps> = ({ label, value, options, onChange }) => {
  const isChecked = value === options[0]; // Assuming options[0] is "Ligado"

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</label>
      <button
        onClick={() => onChange(isChecked ? options[1] : options[0])}
        className={`w-12 h-20 rounded border-2 relative transition-colors duration-200 ${
          isChecked ? 'bg-zinc-800 border-green-500/50' : 'bg-zinc-900 border-zinc-800'
        }`}
      >
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded bg-zinc-700 border border-zinc-600 shadow-sm transition-transform duration-200 ${
            isChecked ? 'top-1' : 'top-10'
          }`}
        ></div>
        {/* Foot switch visual texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>
      </button>
      <div className={`text-[10px] font-mono font-bold ${isChecked ? 'text-green-400' : 'text-zinc-600'}`}>
        {value.toUpperCase()}
      </div>
    </div>
  );
};
