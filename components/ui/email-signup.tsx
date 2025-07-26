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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
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
    <div className="flex w-full flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded border border-gray-300 px-4 py-2"
          disabled={saving}
        />
        <button
          type="submit"
          disabled={saving}
          className={`min-w-[140px] rounded px-4 py-2 text-white transition-colors ${
            saving
              ? 'cursor-not-allowed bg-gray-400'
              : 'cursor-pointer bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
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
