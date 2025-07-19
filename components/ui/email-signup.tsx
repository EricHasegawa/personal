'use client';

import { useState } from 'react';

const enum ResponseStatus {
  Success = 'success',
  Error = 'error',
}

export const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<ResponseStatus | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      setStatus(res.ok ? ResponseStatus.Success : ResponseStatus.Error);
      if (res.ok) setEmail('');
    } catch {
      setStatus(ResponseStatus.Error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded px-4 py-2 w-full"
          disabled={saving}
        />
        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 rounded text-white transition-colors min-w-[140px] ${
            saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 cursor-pointer'
          }`}
        >
          {saving ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      <div className="text-sm">
        {status === ResponseStatus.Success && (
          <p className="text-green-600">Thanks for subscribing!</p>
        )}
        {status === ResponseStatus.Error && (
          <p className="text-red-600">Something went wrong.</p>
        )}
      </div>
    </div>
  );
};
