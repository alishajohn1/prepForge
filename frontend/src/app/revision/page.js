'use client';
import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { getRevisionList, updateProblemStatus } from '@/lib/api';

export default function RevisionPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRevisionList()
      .then(d => setProblems(d.problems))
      .finally(() => setLoading(false));
  }, []);

  const markSolved = async (id) => {
    await updateProblemStatus(id, 'SOLVED', null);
    setProblems(prev => prev.filter(p => p.id !== id));
  };

  const removeMark = async (id) => {
    await updateProblemStatus(id, 'PENDING', null);
    setProblems(prev => prev.filter(p => p.id !== id));
  };

  const diffColor = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };

  return (
    <AppShell>
      <div className="animate-slide-up">
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
            }}>🔁</div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300 }}>
                Revision Mode
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Problems you've marked for revision
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
            Loading revision list...
          </div>
        ) : problems.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, marginBottom: '8px' }}>
              No problems in revision list!
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Mark problems as "Revision" from the DSA Sheet to add them here.
            </div>
          </div>
        ) : (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px 20px', marginBottom: '20px',
              background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: '10px',
            }}>
              <span style={{ fontSize: '20px' }}>💡</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 300, color: 'var(--text-primary)' }}>
                  {problems.length} problem{problems.length !== 1 ? 's' : ''} to review
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Solve each one again to strengthen your understanding. Mark as Solved when you're confident.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {problems.map((p, i) => (
                <div
                  key={p.id}
                  className="card card-hover"
                  style={{ padding: '18px 20px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '11px',
                          color: 'var(--text-muted)',
                          background: 'var(--bg-secondary)',
                          padding: '2px 6px', borderRadius: '4px',
                        }}>#{i + 1}</span>
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '15px', fontWeight: 300, color: 'var(--text-primary)', textDecoration: 'none' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-bright)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                        >
                          {p.title} ↗
                        </a>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: p.notes ? '10px' : 0 }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.topic}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>·</span>
                        <span style={{ fontSize: '12px', fontWeight: 300, color: diffColor[p.difficulty] }}>{p.difficulty}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>·</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.platform}</span>
                      </div>
                      {p.notes && (
                        <div style={{
                          fontSize: '12px', color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          background: 'var(--bg-secondary)',
                          padding: '8px 12px', borderRadius: '6px',
                          borderLeft: '3px solid var(--revision)',
                        }}>
                          📝 {p.notes}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        className="btn-ghost"
                        onClick={() => removeMark(p.id)}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        Remove
                      </button>
                      <button
                        className="btn-primary"
                        onClick={() => markSolved(p.id)}
                        style={{ fontSize: '12px', padding: '6px 12px', background: 'var(--success)' }}
                      >
                        ✓ Mark Solved
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
