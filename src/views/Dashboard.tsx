import { useAppStore, type Module } from '../store/appStore'
import {
  Dna, FlaskConical, Atom, Stethoscope, Bug, BookOpen, Cpu, Brain,
  Scissors, Network, Shield, Beaker, Zap, Waves, Radiation, Eye, Pill,
  Syringe, TestTube2, Database, Clock, Calculator, HelpCircle,
  Layers, ArrowRight, Play, Sparkles, Star
} from 'lucide-react'

interface FeatureCard {
  title: string
  desc: string
  view: Module
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>
  color: string
  badge?: string
  hot?: boolean
}

const FEATURED: FeatureCard[] = [
  { title: '3D Protein Viewer', desc: 'Rotate real PDB protein structures in full 3D', view: 'protein3d', icon: Cpu, color: '#22d3ee', badge: '3D', hot: true },
  { title: '3D DNA Helix', desc: 'Interactive double-helix with base coloring', view: 'dna3d', icon: Dna, color: '#10b981', badge: '3D' },
  { title: 'AI Diagnosis', desc: 'Symptoms → Disease prediction with AI', view: 'diagnosis', icon: Stethoscope, color: '#a855f7', badge: 'AI', hot: true },
  { title: 'Disease Database', desc: 'Explore diseases, causes, cures & pathways', view: 'diseasedb', icon: Bug, color: '#ef4444', badge: 'NEW' },
  { title: 'Drug Candidates', desc: 'Find potential drugs for any disease', view: 'drugcandidate', icon: TestTube2, color: '#10b981', badge: 'NEW', hot: true },
  { title: '3D Molecule View', desc: 'Chemistry molecules in 3D with atom bonds', view: 'molecules3d', icon: FlaskConical, color: '#f59e0b', badge: '3D' },
  { title: 'Periodic Table', desc: '118 elements with orbitals & properties', view: 'periodic', icon: Atom, color: '#f59e0b' },
  { title: 'CRISPR Editor', desc: 'Edit DNA strands with Cas9 visually', view: 'crispr', icon: Scissors, color: '#22d3ee' },
  { title: 'Clinical Cases', desc: 'Solve real-world patient diagnosis cases', view: 'clinical', icon: Syringe, color: '#ef4444', badge: 'MED' },
  { title: 'Genomics Explorer', desc: 'Gene expression, mutations, SNP analysis', view: 'genomics', icon: Database, color: '#a855f7', badge: 'NEW' },
  { title: 'Research Hub', desc: 'Latest PubMed papers & science news', view: 'research', icon: BookOpen, color: '#3b82f6', badge: 'NEW' },
  { title: 'Immunology', desc: 'Immune cells, antibodies, defense pathways', view: 'immunology', icon: Shield, color: '#a855f7', badge: 'NEW' },
]

const QUICK_ACCESS: { label: string; view: Module; icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }> }[] = [
  { label: 'Neuroscience',    view: 'neuroscience',  icon: Brain },
  { label: 'Quantum Chem',   view: 'quantum',       icon: Zap },
  { label: 'Mechanics',      view: 'mechanics',     icon: Waves },
  { label: 'Anatomy 3D',     view: 'anatomy',       icon: Eye },
  { label: 'Pharmacology',   view: 'pharmacology',  icon: Pill },
  { label: 'Nuclear Physics', view: 'nuclear',      icon: Radiation },
  { label: 'Metabolic Paths', view: 'metabolic',    icon: Network },
  { label: 'Quiz Mode',      view: 'quiz',          icon: HelpCircle },
  { label: 'Flashcards',     view: 'flashcards',    icon: Layers },
  { label: 'Calculators',    view: 'tools',         icon: Calculator },
  { label: 'Timeline',       view: 'timeline',      icon: Clock },
  { label: 'Knowledge Base', view: 'kb',            icon: BookOpen },
]

const STATS = [
  { label: 'Modules',     value: '30+', icon: Cpu,       color: '#22d3ee' },
  { label: 'Simulations', value: '50+', icon: Beaker,    color: '#10b981' },
  { label: 'Education Levels', value: '6',   icon: Star,      color: '#a855f7' },
  { label: 'Subjects',    value: '5',   icon: BookOpen,  color: '#f59e0b' },
]

export default function Dashboard() {
  const { setModule, level } = useAppStore()

  const levelGreet: Record<string, { title: string; sub: string }> = {
    K12:      { title: 'Welcome, Young Scientist! 🎒', sub: 'Discover the amazing world of science with fun animations and easy explanations!' },
    undergrad:{ title: 'Bio-Labs Science Platform 🔬', sub: 'A complete virtual lab for biology, chemistry, physics & medicine.' },
    grad:     { title: 'Advanced Research Platform 🧪', sub: 'Cutting-edge simulations, genomics tools & disease discovery for graduate research.' },
    phd:      { title: 'PhD-Level Science Suite 🎓', sub: 'Full-stack discovery platform: molecular dynamics, genomics, drug discovery & clinical insights.' },
  }
  const greet = levelGreet[level] ?? levelGreet.undergrad

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="surface-elevated" style={{ padding: '2.5rem', marginBottom: '2rem', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.1), transparent 70%)', filter: 'blur(30px)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%)', filter: 'blur(30px)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '60%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)', filter: 'blur(40px)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'shimmer 1.5s infinite' }} />
              Kindergarten → PhD Platform
            </span>
            <span className="badge badge-green">50+ Simulations</span>
            <span className="badge badge-purple">AI-Powered</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '0.75rem', lineHeight: 1.1 }}>
            {greet.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: 600, lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {greet.sub}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => setModule('protein3d')}>
              <Play size={16} /> Launch 3D Protein Lab
            </button>
            <button className="btn btn-secondary" onClick={() => setModule('diagnosis')}>
              <Stethoscope size={16} /> AI Diagnosis Tool
            </button>
            <button className="btn btn-secondary" onClick={() => setModule('diseasedb')} style={{ borderColor: 'var(--accent-3)', color: 'var(--accent-3)' }}>
              <Bug size={16} /> Disease Discovery
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {STATS.map(s => (
          <div key={s.label} className="glow-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{s.label}</p>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: s.color }}>{s.value}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={22} style={{ color: s.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Modules */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>⭐ Featured Modules</h3>
          <button className="btn btn-ghost" style={{ fontSize: '0.78rem' }}>View all <ArrowRight size={13} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {FEATURED.map(f => (
            <div
              key={f.view}
              className="glow-card"
              style={{ padding: '1.25rem', cursor: 'pointer', position: 'relative' }}
              onClick={() => setModule(f.view)}
            >
              {f.hot && (
                <span style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                  🔥 HOT
                </span>
              )}
              <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: `${f.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                <f.icon size={22} style={{ color: f.color }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2, flex: 1 }}>{f.title}</h4>
                {f.badge && <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 5px', borderRadius: 3, background: `${f.color}20`, color: f.color, flexShrink: 0 }}>{f.badge}</span>}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
              <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: f.color, fontSize: '0.78rem', fontWeight: 600 }}>
                Open <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>⚡ Quick Access</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {QUICK_ACCESS.map(q => (
            <button
              key={q.view}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', gap: '0.4rem' }}
              onClick={() => setModule(q.view)}
            >
              <q.icon size={14} />
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Promo */}
      <div style={{
        padding: '1.5rem', borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(34,211,238,0.06))',
        border: '1px solid rgba(168,85,247,0.3)',
        display: 'flex', gap: '1rem', alignItems: 'center',
      }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-3), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={24} color="#060d1a" />
        </div>
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>🤖 AI Tutor — Adapts to YOUR Level</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Currently set to <strong style={{ color: 'var(--accent)' }}>{level.toUpperCase()}</strong> level. 
            Ask anything — from "What is DNA?" to "Explain CRISPR-Cas9 mechanism with off-target effects."
            Supports Gemini, GPT-4o, and Claude.
          </p>
        </div>
        <button className="btn btn-primary" style={{ flexShrink: 0, background: 'linear-gradient(135deg, var(--accent-3), var(--accent))' }} onClick={() => useAppStore.getState().toggleAI()}>
          <Sparkles size={15} /> Ask AI
        </button>
      </div>
    </div>
  )
}
