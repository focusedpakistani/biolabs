import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { Dna, Search, Sun, Moon, Menu, Sparkles, Bell, GraduationCap } from 'lucide-react'

const LEVELS = [
  { id: 'K12',      label: 'K-12',      emoji: '🎒' },
  { id: 'undergrad',label: 'UG',        emoji: '📚' },
  { id: 'grad',     label: 'Grad',      emoji: '🔬' },
  { id: 'phd',      label: 'PhD',       emoji: '🎓' },
]

export default function Header() {
  const { theme, setTheme, toggleSidebar, toggleAI, setSearchOpen, level, setLevel, notifications } = useAppStore()
  const [levelOpen, setLevelOpen] = useState(false)

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50, height: '64px',
      background: 'color-mix(in srgb, var(--bg-secondary) 80%, transparent)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 1.25rem', gap: '0.75rem',
    }}>
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="btn-ghost btn"
        style={{ padding: '0.4rem', borderRadius: '0.5rem' }}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
        <div className="pulse-ring" style={{
          width: 40, height: 40, borderRadius: '0.75rem', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Dna size={20} color="#060d1a" />
        </div>
        <div style={{ display: 'none' }} className="logo-text">
          <div style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.1 }}>Bio-Labs</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Universal Science Platform</div>
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
          <span className="gradient-text">Bio</span>
          <span>-Labs</span>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Online indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.3rem 0.7rem', borderRadius: '999px',
        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
        fontSize: '0.72rem', color: '#10b981',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse-ring 2s infinite', display: 'inline-block' }} />
        Lab Online
      </div>

      {/* Level selector */}
      <div style={{ position: 'relative' }}>
        <button
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', gap: '0.35rem' }}
          onClick={() => setLevelOpen(!levelOpen)}
        >
          <GraduationCap size={14} />
          {LEVELS.find(l => l.id === level)?.emoji} {LEVELS.find(l => l.id === level)?.label}
        </button>
        {levelOpen && (
          <div style={{
            position: 'absolute', top: '110%', right: 0, zIndex: 100,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: '0.75rem', padding: '0.4rem', minWidth: 140,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            {LEVELS.map(l => (
              <div
                key={l.id}
                onClick={() => { setLevel(l.id as any); setLevelOpen(false) }}
                style={{
                  padding: '0.5rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer',
                  background: level === l.id ? 'var(--accent-glow)' : 'transparent',
                  color: level === l.id ? 'var(--accent)' : 'var(--text-primary)',
                  fontSize: '0.8rem', fontWeight: 600,
                  transition: 'all 0.15s',
                }}
              >
                {l.emoji} {l.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <button
        className="btn btn-secondary"
        style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', gap: '0.35rem' }}
        onClick={() => setSearchOpen(true)}
      >
        <Search size={14} />
        <span style={{ opacity: 0.6, display: 'none' }}>Search...</span>
        <kbd style={{ fontSize: '0.65rem', opacity: 0.5, fontFamily: 'monospace' }}>/</kbd>
      </button>

      {/* Notifications */}
      <button
        className="btn btn-ghost"
        style={{ padding: '0.4rem', position: 'relative' }}
        onClick={() => {}}
      >
        <Bell size={18} />
        {notifications.length > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)',
          }} />
        )}
      </button>

      {/* Theme toggle */}
      <button
        className="btn btn-ghost"
        style={{ padding: '0.4rem' }}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* AI button */}
      <button
        onClick={toggleAI}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.4rem 0.85rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, var(--accent-3), var(--accent))',
          color: '#060d1a', fontWeight: 700, fontSize: '0.8rem',
          boxShadow: '0 4px 16px var(--purple-glow)',
          transition: 'all 0.2s',
        }}
      >
        <Sparkles size={15} />
        AI
      </button>
    </header>
  )
}
