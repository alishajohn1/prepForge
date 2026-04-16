'use client';
import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { getDashboardStats, getHeatmap } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

function StreakFlame({ count, size = 80 }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: size,
        lineHeight: 1,
        filter: count > 0 ? 'drop-shadow(0 0 20px #f59e0b)' : 'grayscale(1) opacity(0.3)',
        animation: count > 0 ? 'pulse 2s ease-in-out infinite' : 'none',
        display: 'block',
      }}>🔥</div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '48px',
        fontWeight: 300,
        color: count > 0 ? '#f59e0b' : 'var(--text-muted)',
        lineHeight: 1,
        marginTop: '8px',
      }}>{count}</div>
      <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>day streak</div>
    </div>
  );
}

export default function StreakPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getHeatmap(3)])
      .then(([s, h]) => { setStats(s); setHeatmap(h.heatmap); })
      .finally(() => setLoading(false));
  }, []);

  const last30 = (() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = heatmap.find(h => h.date === dateStr);
      days.push({ date: dateStr, count: found ? parseInt(found.count) : 0, day: d.getDate() });
    }
    return days;
  })();

  const today = stats?.streak.today || 0;
  const goal = user?.daily_goal || 3;
  const progressPct = Math.min(100, Math.round((today / goal) * 100));

  return (
    <AppShell>
      <div className="animate-slide-up">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, marginBottom: '4px' }}>
            Streak Tracker
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Consistency is the key to mastery
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>Loading...</div>
        ) : (
          <>
            {/* Main streak display */}
            <div className="card" style={{
              padding: '48px 24px',
              marginBottom: '24px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, var(--bg-card) 60%)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
                <StreakFlame count={stats?.streak.current || 0} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', lineHeight: 1 }}>🏆</div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '48px',
                    fontWeight: 300, color: 'var(--accent-bright)', lineHeight: 1, marginTop: '8px',
                  }}>
                    {stats?.streak.longest || 0}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>longest streak</div>
                </div>
              </div>

              {stats?.streak.current === 0 && (
                <div style={{
                  marginTop: '24px', padding: '12px 24px',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '8px', display: 'inline-block',
                }}>
                  <span style={{ fontSize: '14px', color: '#fc8181' }}>
                    ⚠️ Solve at least 1 problem today to start your streak!
                  </span>
                </div>
              )}
              {stats?.streak.current > 0 && stats?.streak.current < stats?.streak.longest && (
                <div style={{
                  marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)',
                }}>
                  Keep going! You're {stats.streak.longest - stats.streak.current} days away from your personal best 💪
                </div>
              )}
              {stats?.streak.current > 0 && stats?.streak.current >= stats?.streak.longest && (
                <div style={{
                  marginTop: '24px', fontSize: '14px', color: '#f59e0b',
                }}>
                  🎯 You're at your all-time best streak! Keep it up!
                </div>
              )}
            </div>

            {/* Today's progress */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 300 }}>
                    📅 Today's Goal
                  </h2>
                  <span style={{ fontSize: '13px', color: today >= goal ? 'var(--success)' : 'var(--text-muted)' }}>
                    {today}/{goal} problems
                  </span>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div className="progress-bar" style={{ height: '10px' }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progressPct}%`,
                        background: today >= goal
                          ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                          : 'linear-gradient(90deg, var(--accent), var(--accent-bright))',
                      }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: today >= goal ? 'var(--success)' : 'var(--text-muted)' }}>
                  {today >= goal
                    ? '🎉 Daily goal reached! Amazing work!'
                    : `${goal - today} more to reach your daily goal`}
                </div>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 300, marginBottom: '16px' }}>
                  📈 Streak Stats
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Current Streak', val: `${stats?.streak.current || 0} days`, color: '#f59e0b' },
                    { label: 'Longest Streak', val: `${stats?.streak.longest || 0} days`, color: 'var(--accent-bright)' },
                    { label: 'Today Solved', val: `${today} problems`, color: 'var(--success)' },
                    { label: 'Daily Goal', val: `${goal} problems`, color: 'var(--text-secondary)' },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</span>
                      <span style={{ fontSize: '14px', fontWeight: 300, color: s.color }}>{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Last 30 days */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 300, marginBottom: '20px' }}>
                📊 Last 30 Days
              </h2>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', overflowX: 'auto', paddingBottom: '8px' }}>
                {last30.map(d => {
                  const h = Math.min(60, d.count * 12 + (d.count > 0 ? 8 : 0));
                  const isToday = d.date === new Date().toISOString().split('T')[0];
                  return (
                    <div key={d.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1, minWidth: '20px' }}>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{d.count > 0 ? d.count : ''}</div>
                      <div
                        title={`${d.date}: ${d.count} problems`}
                        style={{
                          width: '100%',
                          height: `${Math.max(4, h)}px`,
                          borderRadius: '4px 4px 2px 2px',
                          background: d.count >= goal
                            ? '#22c55e'
                            : d.count > 0
                              ? '#6366f1'
                              : 'var(--bg-secondary)',
                          border: isToday ? '2px solid var(--accent-bright)' : '1px solid transparent',
                          transition: 'opacity 0.15s',
                          cursor: 'pointer',
                          opacity: isToday ? 1 : 0.85,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scaleX(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = isToday ? '1' : '0.85'; e.currentTarget.style.transform = 'scaleX(1)'; }}
                      />
                      {d.day % 5 === 0 && (
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{d.day}</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#22c55e' }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Goal met</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#6366f1' }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--bg-secondary)' }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Inactive</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
