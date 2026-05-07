'use client';

import { useState, useEffect } from 'react';
import { Albert_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';

const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-albert-sans',
});

export default function SetLawyerPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lawyerId, setLawyerId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('loginId');
      if (id) setLawyerId(id);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate passwords
    if (!password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);

    try {
      // Get loginId from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const loginId = urlParams.get('loginId');

      if (!loginId) {
        throw new Error('Missing loginId. Please use the link sent to you.');
      }

      const response = await fetch('/api/lawyer/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set password');
      }

      const data = await response.json();
      setMessage({ type: 'success', text: `Password set successfully for lawyer ${lawyerId}! Redirecting to dashboard...` });

      // Store tokens in localStorage and redirect to dashboard after 2 seconds
      if (data.token) {
        localStorage.setItem('accessToken', data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to set password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className={`${albertSans.className} text-2xl md:text-3xl font-bold text-[#2D3136] mb-2`}>
            Set Your Password
          </h1>
          <p className="text-[#666666] mb-6 md:mb-8 text-sm md:text-base">
            {lawyerId ? `Create a secure password for your Jurix lawyer ${lawyerId}` : 'Create a secure password for your Jurix lawyer account'}
          </p>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={8}
                placeholder="Enter your password"
              />
              <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={8}
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${albertSans.className} w-full inline-flex items-center justify-center gap-4 px-[10px] py-[10px] rounded-full text-[#FCFCFC] text-[14px] md:text-[16px] shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
              style={{ background: 'linear-gradient(90deg, #4261A8 0%, #304A85 100%)', paddingLeft: '20px' }}
            >
              {loading ? 'Setting Password...' : 'Set Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push('/')}
              className={`${albertSans.className} text-sm text-gray-600 hover:text-gray-800`}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
