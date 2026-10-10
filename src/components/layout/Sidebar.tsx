import { useAppStore, type Module } from '../../store/appStore'
import {
  LayoutDashboard, Dna, FlaskConical, Atom, Microscope, Brain,
  Scissors, Beaker, Zap, Pill, Stethoscope, Search, BookOpen,
  HelpCircle, Layers, Clock, Calculator, Settings, Bug, Database,
  Network, Shield, Waves, Cpu, Radiation, Eye, Activity,
  ChevronRight, TestTube2, Syringe
} from 'lucide-react'

interface NavSection {
  title: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>
  items: { label: string; view: Module; icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>; badge?: string; color?: string }[]
}

const NAV: NavSection[] = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    items: [
      { label: 'Dashboard', view: 'dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: '🧬 Biology',
    icon: Dna,
    items: [
      { label: '3D Protein Viewer',  view: 'protein3d',  icon: Cpu,       badge: '3D',   color: '#22d3ee' },
      { label: '3D DNA / RNA',       view: 'dna3d',      icon: Dna,       badge: '3D',   color: '#10b981' },
      { label: 'Cell Sandbox',       view: 'cell',       icon: Microscope, badge: 'M2' },
      { label: 'CRISPR Editor',      view: 'crispr',     icon: Scissors,   badge: 'M3' },
      { label: 'Metabolic Pathways', view: 'metabolic',  icon: Network,    badge: 'M4' },
      { label: 'Immunology',         view: 'immunology', icon: Shield,     badge: 'NEW', color: '#a855f7' },
      { label: 'Neuroscience',       view: 'neuroscience', icon: Brain,    badge: 'NEW', color: '#a855f7' },
    ]
  },
  {
    title: '⚗️ Chemistry',
    icon: FlaskConical,
    items: [
      { label: 'Periodic Table',   view: 'periodic',    icon: Atom,       badge: '3D', color: '#f59e0b' },
      { label: '3D Molecule View', view: 'molecules3d', icon: FlaskConical, badge: '3D', color: '#22d3ee' },
      { label: 'Reactions Lab',    view: 'reactions',   icon: Beaker,     badge: 'HOT', color: '#ef4444' },
      { label: 'Quantum Chem',     view: 'quantum',     icon: Zap,        badge: 'PHD' },
    ]
  },
  {
    title: '⚛️ Physics',
    icon: Zap,
    items: [
      { label: 'Mechanics Lab',    view: 'mechanics', icon: Activity, },
      { label: 'Waves & Optics',   view: 'waves',     icon: Waves,   },
      { label: 'Nuclear Physics',  view: 'nuclear',   icon: Radiation, badge: 'ADV' },
    ]
  },
  {
    title: '🏥 Medical',
    icon: Stethoscope,
    items: [
      { label: 'Human Anatomy',    view: 'anatomy',       icon: Eye,         badge: '3D', color: '#ef4444' },
      { label: 'Pharmacology',     view: 'pharmacology',  icon: Pill,        },
      { label: 'Clinical Cases',   view: 'clinical',      icon: Syringe,     badge: 'NEW', color: '#a855f7' },
      { label: 'AI Diagnosis',     view: 'diagnosis',     icon: Stethoscope, badge: 'AI',  color: '#22d3ee' },
    ]
  },
  {
    title: '🔬 Discovery',
    icon: Search,
    items: [
      { label: 'Disease Database',    view: 'diseasedb',    icon: Bug,        badge: 'NEW', color: '#ef4444' },
      { label: 'Drug Candidates',     view: 'drugcandidate',icon: TestTube2,  badge: 'NEW', color: '#10b981' },
      { label: 'Research Hub',        view: 'research',     icon: BookOpen,   badge: 'NEW', color: '#f59e0b' },
      { label: 'Genomics Explorer',   view: 'genomics',     icon: Database,   badge: 'NEW', color: '#a855f7' },
    ]
  },
  {
    title: '📚 Learn',
    icon: BookOpen,
    items: [
      { label: 'Knowledge Base',  view: 'kb',         icon: BookOpen  },
      { label: 'Quiz Mode',       view: 'quiz',       icon: HelpCircle},
      { label: 'Flashcards',      view: 'flashcards', icon: Layers    },
      { label: 'History Timeline',view: 'timeline',   icon: Clock     },
      { label: 'Calculators Hub', view: 'tools',      icon: Calculator},
    ]
  },
  {
    title: 'System',
    icon: Settings,
    items: [
      { label: 'Settings', view: 'settings', icon: Settings },
    ]
  },
]

export default function Sidebar() {
  const { currentModule, setModule, sidebarOpen } = useAppStore()

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        minWidth: 'var(--sidebar-width)',
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: '64px',
        overflowY: 'auto',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        padding: '0.75rem',
        transition: 'transform 0.3s',
        zIndex: 40,
        flexShrink: 0,
        ...(window.innerWidth < 1024 ? {
          position: 'fixed' as const,
          top: '64px',
          left: 0,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: 40,
        } : {}),
      }}
    >
      {NAV.map((section) => (
        <div key={section.title} style={{ marginBottom: '0.5rem' }}>
          <div className="nav-section-title">
            <section.icon size={10} />
            {section.title}
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {section.items.map((item) => (
              <div
                key={item.view}
                className={`nav-item ${currentModule === item.view ? 'active' : ''}`}
                onClick={() => setModule(item.view)}
              >
                <item.icon size={15} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '0.8rem' }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.6rem',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: item.color ? `${item.color}22` : 'var(--bg-tertiary)',
                    color: item.color ?? 'var(--accent)',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}>{item.badge}</span>
                )}
                {currentModule === item.view && <ChevronRight size={12} style={{ color: 'var(--accent)' }} />}
              </div>
            ))}
          </nav>
        </div>
      ))}

      {/* Lab tip */}
      <div className="surface" style={{ padding: '0.75rem', marginTop: '1rem' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700, marginBottom: '0.3rem' }}>💡 Lab Tip</p>
        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Use the AI Assistant (✨ button) to get explanations at your level — from kindergarten to PhD!
        </p>
      </div>
    </aside>
  )
}
