'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from './Sidebar';

export default function AppShell({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{
          width: '48px', height: '48px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', animation: 'pulse 2s infinite',
        }}>⚡</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading PrepForge...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: '220px',
        padding: '32px',
        maxWidth: 'calc(100vw - 220px)',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
      }}>
        {children}
      </main>
    </div>
  );
}
