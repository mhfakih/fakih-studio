'use client';
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError('');
    setMediaUrl('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Gagal membuat media');

      setMediaUrl(data.videoUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-slate-950 text-white">
      {/* Branding Header */}
      <header className="w-full max-w-4xl flex justify-between items-center py-6 border-b border-slate-800 mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl">F</div>
          <span className="text-xl font-bold tracking-wide">Fakih <span className="text-blue-500">Studio</span></span>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">AI Engine v1.0</span>
      </header>

      {/* Hero Section & Input */}
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">AI Media Generator</h1>
          <p className="text-slate-400 text-sm">Buat aset media visual otomatis bertenaga AI dari Fakih Studio</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <textarea
            className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
            rows={4}
            placeholder="Contoh: A cinematic shot of a futuristic motorcycle driving in a rainy neon city..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl font-semibold transition text-white shadow-lg shadow-blue-600/20"
          >
            {loading ? 'Sedang Memproses di Fakih Studio...' : 'Generate Media'}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {mediaUrl && (
          <div className="mt-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 p-2 shadow-2xl">
            {/* Menampilkan Gambar */}
            <img 
              src={mediaUrl} 
              alt="AI Generated Media" 
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>
        )}
      </div>
    </main>
  );
}