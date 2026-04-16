'use client';
import { useState, useEffect, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import { getProblems, getTopics, updateProblemStatus } from '@/lib/api';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const STATUSES = ['All', 'PENDING', 'SOLVED', 'REVISION'];

function StatusButton({ current, value, onChange }) {
  const configs = {
    SOLVED: { label: '✓ Solved', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', color: '#22c55e' },
    REVISION: { label: '↺ Revise', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)', color: '#a78bfa' },
    PENDING: { label: '○ Pending', bg: 'rgba(90,90,114,0.1)', border: 'rgba(90,90,114,0.2)', color: 'var(--text-muted)' },
  };
  const c = configs[value];
  const isActive = current === value;
  return (
    <button
      onClick={() => onChange(value)}
      style={{
        padding: '4px 10px',
        borderRadius: '6px',
        border: `1px solid ${isActive ? c.border : 'transparent'}`,
        background: isActive ? c.bg : 'transparent',
        color: isActive ? c.color : 'var(--text-muted)',
        fontSize: '12px',
        fontFamily: 'var(--font-body)',
        fontWeight: isActive ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = c.bg; e.currentTarget.style.color = c.color; } }}
      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
    >
      {c.label}
    </button>
  );
}

function ProblemRow({ problem, onStatusChange }) {
  const [updating, setUpdating] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(problem.notes || '');

  const handleStatusChange = async (newStatus) => {
    if (updating) return;
    setUpdating(true);
    try {
      await updateProblemStatus(problem.id, newStatus, notes);
      onStatusChange(problem.id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    setUpdating(true);
    try {
      await updateProblemStatus(problem.id, problem.status, notes);
      setShowNotes(false);
    } finally {
      setUpdating(false);
    }
  };

  const diffColor = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };
  const statusBg = {
    SOLVED: 'rgba(34,197,94,0.03)',
    REVISION: 'rgba(139,92,246,0.03)',
    PENDING: 'transparent',
  };

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '48px 1fr 120px 80px auto',
        gap: '12px',
        padding: '13px 16px',
        borderBottom: '1px solid var(--border)',
        alignItems: 'center',
        background: statusBg[problem.status],
        transition: 'background 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = statusBg[problem.status]; }}
      >
        {/* Index */}
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
          {String(problem.order_index).padStart(3, '0')}
        </span>

        {/* Title */}
        <div>
          <a
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: problem.status === 'SOLVED' ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: problem.status === 'SOLVED' ? 'line-through' : 'none',
              fontSize: '14px',
              fontWeight: 300,
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-bright)'; e.currentTarget.style.textDecoration = 'none'; }}
            onMouseLeave={e => { e.currentTarget.style.color = problem.status === 'SOLVED' ? 'var(--text-muted)' : 'var(--text-primary)'; e.currentTarget.style.textDecoration = problem.status === 'SOLVED' ? 'line-through' : 'none'; }}
          >
            {problem.title}
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{problem.topic}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>·</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{problem.platform}</span>
            {problem.notes && (
              <>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>·</span>
                <span style={{ fontSize: '11px', color: 'var(--accent-bright)' }}>📝 note</span>
              </>
            )}
          </div>
        </div>

        {/* Status buttons */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {['SOLVED', 'REVISION'].map(s => (
            <StatusButton key={s} current={problem.status} value={s} onChange={handleStatusChange} />
          ))}
        </div>

        {/* Difficulty */}
        <span style={{
          fontSize: '12px',
          fontWeight: 300,
          color: diffColor[problem.difficulty],
          textAlign: 'center',
        }}>
          {problem.difficulty}
        </span>

        {/* Notes icon */}
        <button
          onClick={() => setShowNotes(v => !v)}
          title="Add notes"
          style={{
            background: showNotes ? 'rgba(99,102,241,0.1)' : 'transparent',
            border: '1px solid ' + (showNotes ? 'rgba(99,102,241,0.3)' : 'transparent'),
            borderRadius: '6px',
            padding: '4px 8px',
            color: showNotes ? 'var(--accent-bright)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.15s',
          }}
        >
          📝
        </button>
      </div>

      {showNotes && (
        <div style={{ padding: '12px 76px', borderBottom: '1px solid var(--border)', background: 'rgba(99,102,241,0.03)' }}>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add your notes, approach, complexity analysis..."
            style={{
              width: '100%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '10px 12px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              resize: 'vertical',
              minHeight: '80px',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
            <button className="btn-ghost" onClick={() => setShowNotes(false)} style={{ padding: '6px 12px', fontSize: '12px' }}>Cancel</button>
            <button className="btn-primary" onClick={handleSaveNotes} disabled={updating} style={{ padding: '6px 12px', fontSize: '12px' }}>
              {updating ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function SheetPage() {
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ topic: 'All', difficulty: 'All', status: 'All', search: '' });
  const [page, setPage] = useState(1);
  const LIMIT = 50;

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProblems({ ...filters, page, limit: LIMIT });
      setProblems(data.problems);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchProblems(); }, [fetchProblems]);
  useEffect(() => { getTopics().then(d => setTopics(['All', ...d.topics])); }, []);

  const handleStatusChange = (problemId, newStatus) => {
    setProblems(prev => prev.map(p => p.id === problemId ? { ...p, status: newStatus } : p));
  };

  const setFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val }));
    setPage(1);
  };

  const solved = problems.filter(p => p.status === 'SOLVED').length;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <AppShell>
      <div className="animate-slide-up">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, marginBottom: '4px' }}>
              Top 180 DSA Sheet
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Curated problems across all core topics · Track your progress below
            </p>
          </div>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px',
            padding: '12px 20px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 300, color: 'var(--success)' }}>
              {total > 0 ? Math.round((problems.filter(p => p.status === 'SOLVED').length / Math.min(total, LIMIT)) * 100) : 0}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>page completion</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <input
            className="input-field"
            placeholder="🔍 Search problems..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            style={{ flex: '1 1 200px', maxWidth: '280px' }}
          />

          {/* Topic */}
          <select
            value={filters.topic}
            onChange={e => setFilter('topic', e.target.value)}
            style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px',
              padding: '10px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
              fontSize: '14px', outline: 'none', cursor: 'pointer',
            }}
          >
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* Difficulty filter pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => setFilter('difficulty', d)}
                style={{
                  padding: '8px 14px', borderRadius: '8px', border: 'none',
                  background: filters.difficulty === d ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: filters.difficulty === d ? 'white' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 300, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >{d}</button>
            ))}
          </div>

          {/* Status filter */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setFilter('status', s)}
                style={{
                  padding: '8px 14px', borderRadius: '8px', border: 'none',
                  background: filters.status === s ? 'var(--bg-card-hover)' : 'var(--bg-secondary)',
                  color: filters.status === s ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)', fontSize: '13px', cursor: 'pointer',
                  transition: 'all 0.15s',
                  borderBottom: filters.status === s ? '2px solid var(--accent)' : '2px solid transparent',
                }}
              >{s === 'All' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}</button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Showing {problems.length} of {total} problems
          {filters.status === 'All' && ` · ${solved} solved on this page`}
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '48px 1fr 120px 80px auto',
            gap: '12px',
            padding: '10px 16px',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border)',
          }}>
            {['#', 'Problem', 'Status', 'Difficulty', ''].map((h, i) => (
              <div key={i} style={{ fontSize: '11px', fontWeight: 300, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: i === 3 ? 'center' : 'left' }}>
                {h}
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading problems...
            </div>
          ) : problems.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No problems found for the selected filters
            </div>
          ) : (
            problems.map(p => (
              <ProblemRow key={p.id} problem={p} onStatusChange={handleStatusChange} />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            <button className="btn-ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
            <span style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Page {page} of {totalPages}
            </span>
            <button className="btn-ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
