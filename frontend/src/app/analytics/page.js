'use client';
import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { getDashboardStats, getHeatmap } from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#4f46e5', '#7c3aed', '#9333ea', '#a855f7', '#22c55e'];

function HeatmapGrid({ data }) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(startDate.getFullYear() - 1);

  const dataMap = {};
  data.forEach(d => { dataMap[d.date] = d.count; });

  const weeks = [];
  const curr = new Date(startDate);
  // align to Sunday
  curr.setDate(curr.getDate() - curr.getDay());

  while (curr <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = curr.toISOString().split('T')[0];
      const count = dataMap[dateStr] || 0;
      const inRange = curr >= startDate && curr <= today;
      week.push({ date: dateStr, count, inRange });
      curr.setDate(curr.getDate() + 1);
    }
    weeks.push(week);
  }

  const getColor = (count) => {
    if (count === 0) return 'var(--bg-secondary)';
    if (count === 1) return 'rgba(99,102,241,0.3)';
    if (count <= 3) return 'rgba(99,102,241,0.5)';
    if (count <= 6) return 'rgba(99,102,241,0.75)';
    return '#6366f1';
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '8px' }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingTop: '18px', marginRight: '4px' }}>
          {days.map(d => (
            <div key={d} style={{ height: '12px', fontSize: '9px', color: 'var(--text-muted)', lineHeight: '12px' }}>
              {d[0]}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {wi % 4 === 0 && (
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', height: '14px', lineHeight: '14px' }}>
                {week[0]?.date ? new Date(week[0].date).toLocaleString('default', { month: 'short' }) : ''}
              </div>
            )}
            {wi % 4 !== 0 && <div style={{ height: '14px' }} />}
            {week.map((day, di) => (
              <div
                key={di}
                title={day.inRange ? `${day.date}: ${day.count} problems` : ''}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  background: day.inRange ? getColor(day.count) : 'transparent',
                  border: day.inRange ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  cursor: day.count > 0 ? 'pointer' : 'default',
                  transition: 'transform 0.1s',
                }}
                onMouseEnter={e => { if (day.count > 0) e.currentTarget.style.transform = 'scale(1.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Less</span>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{ width: '12px', height: '12px', borderRadius: '2px', background: getColor(i === 0 ? 0 : i === 1 ? 1 : i === 2 ? 3 : i === 3 ? 5 : 8) }} />
        ))}
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>More</span>
      </div>
    </div>
  );
}

const customTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ fontSize: '14px', fontWeight: 300, color: p.color }}>{p.name}: {p.value}</div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getHeatmap(12)])
      .then(([s, h]) => { setStats(s); setHeatmap(h.heatmap); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>Loading analytics...</div>
      </AppShell>
    );
  }

  const topicBarData = stats?.topics.map(t => ({
    topic: t.topic.replace(' & ', '\n& ').replace('Dynamic Programming', 'DP'),
    solved: t.solved,
    remaining: t.total - t.solved,
    percentage: t.percentage,
  })) || [];

  const pieData = stats?.difficulty.map(d => ({
    name: d.difficulty,
    value: d.solved,
    total: d.total,
  })) || [];

  const radarData = stats?.topics.map(t => ({
    topic: t.topic.split(' ')[0],
    percentage: t.percentage,
    fullMark: 100,
  })) || [];

  return (
    <AppShell>
      <div className="animate-slide-up">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, marginBottom: '4px' }}>
            Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Deep insights into your DSA preparation journey
          </p>
        </div>

        {/* Heatmap */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 300, marginBottom: '4px' }}>
            🗺️ Activity Heatmap
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Your problem-solving activity over the past 12 months
          </p>
          <HeatmapGrid data={heatmap} />
        </div>

        {/* Topic bar + pie */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 300, marginBottom: '20px' }}>
              📊 Topic Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topicBarData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="topic"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="solved" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} name="Solved" />
                <Bar dataKey="remaining" stackId="a" fill="rgba(99,102,241,0.15)" radius={[4, 4, 0, 0]} name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 300, marginBottom: '20px' }}>
              🎯 Solved by Difficulty
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={['#22c55e', '#f59e0b', '#ef4444'][i]} />
                  ))}
                </Pie>
                <Tooltip content={customTooltip} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ['#22c55e', '#f59e0b', '#ef4444'][i] }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 300 }}>{d.value}/{d.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radar chart */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 300, marginBottom: '20px' }}>
            🕸️ Skill Radar
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="topic" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Radar name="Completion %" dataKey="percentage" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip content={customTooltip} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppShell>
  );
}
