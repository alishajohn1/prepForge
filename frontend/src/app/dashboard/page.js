'use client';
import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { useAuth } from '@/lib/auth-context';
import { getDashboardStats, getWeakTopics, updateDailyGoal } from '@/lib/api';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

function StatCard({ title, value, sub, icon, color = 'var(--accent)' }) {
  return (
    <div className="card" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 300 }}>{title}</span>
        <span style={{ fontSize: '18px' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: 300, color }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

function TopicProgressRow({ topic, solved, total, percentage }) {
  const isWeak = percentage < 50;
  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 300, color: 'var(--text-primary)' }}>{topic}</span>
          {isWeak && (
            <span style={{
              fontSize: '10px', padding: '1px 6px', borderRadius: '4px',
              background: 'rgba(239,68,68,0.1)', color: '#fc8181',
              border: '1px solid rgba(239,68,68,0.2)', fontWeight: 300,
            }}>WEAK</span>
          )}
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 300 }}>{solved}</span>/{total}
          <span style={{ marginLeft: '8px', color: isWeak ? '#fc8181' : 'var(--success)' }}>({percentage}%)</span>
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            background: isWeak
              ? 'linear-gradient(90deg, #ef4444, #f97316)'
              : 'linear-gradient(90deg, var(--accent), var(--accent-bright))',
          }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, setUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goalInput, setGoalInput] = useState('');
  const [savingGoal, setSavingGoal] = useState(false);

  useEffect(() => {
    Promise.all([getDashboardStats(), getWeakTopics()])
      .then(([s, w]) => {
        setStats(s);
        setWeakTopics(w.weakTopics);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveGoal = async () => {
    const g = parseInt(goalInput);
    if (!g || g < 1 || g > 20) return;
    setSavingGoal(true);
    try {
      await updateDailyGoal(g);
      setUser(u => ({ ...u, daily_goal: g }));
      setGoalInput('');
    } finally {
      setSavingGoal(false);
    }
  };

  return (
    <AppShell>
      <div className="animate-slide-up">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 300 }}>
            Welcome back, {user?.username} 👋
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--text-primary)' }}>
            Your Dashboard
          </h1>
        </div>

        {loading ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px' }}>Loading stats...</div>
        ) : stats ? (
          <>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <StatCard
                title="Total Solved"
                value={`${stats.overall.solved}/${stats.overall.total}`}
                sub={`${stats.overall.percentage}% complete`}
                icon="✅"
                color="var(--success)"
              />
              <StatCard
                title="Current Streak"
                value={`${stats.streak.current}🔥`}
                sub={`Longest: ${stats.streak.longest} days`}
                icon="🔥"
                color="var(--warning)"
              />
              <StatCard
                title="Today's Progress"
                value={`${stats.streak.today}/${user?.daily_goal}`}
                sub={stats.streak.today >= user?.daily_goal ? '🎯 Goal reached!' : `${user?.daily_goal - stats.streak.today} more to go`}
                icon="📅"
                color="var(--accent-bright)"
              />
              <StatCard
                title="For Revision"
                value={stats.overall.revision}
                sub="Problems marked"
                icon="🔁"
                color="var(--revision)"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* Overall ring */}
              <div className="card" style={{ padding: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 300, marginBottom: '20px' }}>
                  Overall Completion
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ position: 'relative', width: 120, height: 120 }}>
                    <ResponsiveContainer width={120} height={120}>
                      <RadialBarChart
                        cx={60} cy={60} innerRadius={40} outerRadius={55}
                        data={[{ value: stats.overall.percentage, fill: '#6366f1' }]}
                        startAngle={90} endAngle={-270}
                      >
                        <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'var(--bg-secondary)' }} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: '18px', color: 'var(--text-primary)' }}>
                        {stats.overall.percentage}%
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Solved', val: stats.overall.solved, color: 'var(--success)' },
                      { label: 'Revision', val: stats.overall.revision, color: 'var(--revision)' },
                      { label: 'Pending', val: stats.overall.pending, color: 'var(--text-muted)' },
                    ].map(s => (
                      <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</span>
                        <span style={{ fontSize: '14px', fontWeight: 300, color: s.color, marginLeft: 'auto' }}>{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div className="card" style={{ padding: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 300, marginBottom: '20px' }}>
                  By Difficulty
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {stats.difficulty.map(d => (
                    <div key={d.difficulty}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span className={`difficulty-${d.difficulty.toLowerCase()}`} style={{ fontSize: '13px', fontWeight: 300 }}>
                          {d.difficulty}
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{d.solved}/{d.total}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{
                          width: `${d.percentage}%`,
                          background: d.difficulty === 'Easy' ? '#22c55e' : d.difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Topic Progress */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 300, marginBottom: '4px' }}>
                  Topic Progress
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Topics below 50% are flagged as weak
                </p>
                <div>
                  {stats.topics.map(t => (
                    <TopicProgressRow key={t.topic} {...t} />
                  ))}
                </div>
              </div>

              {/* Weak Topics + Daily Goal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {weakTopics.length > 0 && (
                  <div className="card" style={{ padding: '20px' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 300, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🧠 Weak Topics
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {weakTopics.map(t => (
                        <div key={t.topic} style={{
                          padding: '10px 14px',
                          background: 'rgba(239,68,68,0.05)',
                          border: '1px solid rgba(239,68,68,0.15)',
                          borderRadius: '8px',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 300 }}>{t.topic}</span>
                            <span style={{ fontSize: '12px', color: '#fc8181', fontWeight: 300 }}>{t.percentage}%</span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                            {t.solved}/{t.total} solved
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card" style={{ padding: '20px' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 300, marginBottom: '16px' }}>
                    📅 Daily Goal
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Current: <strong style={{ color: 'var(--text-primary)' }}>{user?.daily_goal} problems/day</strong>
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      className="input-field"
                      type="number"
                      min="1" max="20"
                      placeholder="New goal"
                      value={goalInput}
                      onChange={e => setGoalInput(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      className="btn-primary"
                      onClick={handleSaveGoal}
                      disabled={savingGoal || !goalInput}
                      style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}
                    >
                      {savingGoal ? '...' : 'Set'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
