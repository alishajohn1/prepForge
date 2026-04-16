'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { login, register } from '@/lib/api';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, loginUser } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let data;
      if (mode === 'login') {
        data = await login(form.email, form.password);
      } else {
        data = await register(form.username, form.email, form.password);
      }
      loginUser(data.user, data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        gap: '80px',
        flexWrap: 'wrap',
      }}>
        {/* Left: branding */}
        <div style={{ maxWidth: '480px', flex: '1 1 320px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '100px',
            padding: '6px 16px',
            marginBottom: '28px',
          }}>
            <span style={{ fontSize: '20px' }}>⚡</span>
            <span style={{ fontSize: '13px', color: 'var(--accent-bright)', fontWeight: 300, letterSpacing: '0.05em' }}>
              DSA TRACKER
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: '20px',
          }}>
            <span className="text-gradient">PrepForge</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>Your DSA</span>
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>Command Center</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '17px', lineHeight: 1.7, marginBottom: '36px', maxWidth: '420px' }}>
            Track 180 curated DSA problems, analyze weak spots, maintain streaks, and ace your next tech interview.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              { icon: '📊', label: 'Topic Analytics' },
              { icon: '🔥', label: 'Streak Engine' },
              { icon: '🔁', label: 'Revision Mode' },
              { icon: '🧠', label: 'Weak Spot Detection' },
              { icon: '📅', label: 'Daily Goals' },
              { icon: '🗺️', label: 'GitHub Heatmap' },
            ].map(f => (
              <div key={f.label} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: auth form */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '36px',
          flex: '0 0 auto',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            padding: '4px',
            marginBottom: '28px',
          }}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: mode === m ? 'var(--accent)' : 'transparent',
                  color: mode === m ? 'white' : 'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 300 }}>
                  Username
                </label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="striver_fan_2025"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 300 }}>
                Email
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 300 }}>
                Password
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '13px',
                color: '#fc8181',
              }}>
                {error}
              </div>
            )}

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', marginTop: '4px' }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? '⚡ Sign In' : '🚀 Create Account'}
            </button>
          </form>

          {mode === 'login' && (
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
              No account?{' '}
              <button
                onClick={() => setMode('register')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-bright)', cursor: 'pointer', fontWeight: 300 }}
              >
                Sign up free
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px', borderTop: '1px solid var(--border)' }}>
        PrepForge — Built for serious DSA prep 🔥
      </div>
    </div>
  );
}
