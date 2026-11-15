import React, { useState } from 'react';

export function JsonModal({ isOpen, onClose, initialJson, onImportJson }) {
  const [jsonText, setJsonText] = useState(initialJson);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setFeedback('✅ JSON berhasil disalin ke clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'genshin_gauntlet_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyImport = () => {
    try {
      onImportJson(jsonText);
      setFeedback('✅ Data JSON berhasil diimpor!');
      setTimeout(onClose, 600);
    } catch (err) {
      setFeedback(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Manajemen Raw JSON (Input & Output)</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            ✕ Tutup
          </button>
        </div>

        <textarea
          rows={14}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300"
        />

        {feedback && <div className="text-xs text-amber-300">{feedback}</div>}

        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              📋 Copy Raw JSON
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              ⬇️ Download .json
            </button>
          </div>
          <button
            onClick={handleApplyImport}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
          >
            📥 Terapkan / Import JSON
          </button>
        </div>
      </div>
    </div>
  );
}