import { useState, useEffect, useRef } from 'react'
import { useAppStore, type Module } from '../../store/appStore'
import { Search, X, Dna, Atom, FlaskConical, Stethoscope, Bug, BookOpen, Cpu } from 'lucide-react'

interface SearchResult {
  label: string
  view: Module
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>
  category: string
}

const SEARCH_INDEX: SearchResult[] = [
  { label: '3D Protein Viewer',    view: 'protein3d',    description: 'Rotate and explore protein structures', icon: Cpu,           category: 'Biology' },
  { label: '3D DNA Helix',         view: 'dna3d',        description: 'Interactive double helix, CRISPR visualization', icon: Dna,  category: 'Biology' },
  { label: 'Cell Sandbox',         view: 'cell',         description: 'Animate organelles and cell processes', icon: Dna,           category: 'Biology' },
  { label: 'CRISPR Editor',        view: 'crispr',       description: 'Cut, edit DNA sequences with Cas9', icon: Dna,              category: 'Biology' },
  { label: 'Immunology',           view: 'immunology',   description: 'Antibodies, T-cells, immune response', icon: Dna,           category: 'Biology' },
  { label: 'Neuroscience',         view: 'neuroscience', description: 'Neurons, action potentials, brain maps', icon: Dna,          category: 'Biology' },
  { label: 'Periodic Table',       view: 'periodic',     description: '118 elements, electron config, 3D orbitals', icon: Atom,     category: 'Chemistry' },
  { label: '3D Molecule Viewer',   view: 'molecules3d',  description: 'Load PDB/SDF files, rotate molecules', icon: Atom,          category: 'Chemistry' },
  { label: 'Reactions Lab',        view: 'reactions',    description: 'Balance equations, simulate reactions', icon: FlaskConical,  category: 'Chemistry' },
  { label: 'Quantum Chemistry',    view: 'quantum',      description: 'Molecular orbitals, DFT, wave functions', icon: Atom,        category: 'Chemistry' },
  { label: 'Mechanics Lab',        view: 'mechanics',    description: 'Forces, motion, energy simulations', icon: Atom,            category: 'Physics' },
  { label: 'Waves & Optics',       view: 'waves',        description: 'Interference, diffraction, EM waves', icon: Atom,           category: 'Physics' },
  { label: 'Nuclear Physics',      view: 'nuclear',      description: 'Radioactive decay, fission, fusion', icon: Atom,            category: 'Physics' },
  { label: 'Human Anatomy',        view: 'anatomy',      description: 'Interactive 3D body systems', icon: Stethoscope,           category: 'Medical' },
  { label: 'Pharmacology',         view: 'pharmacology', description: 'Drug mechanisms, receptor binding', icon: Stethoscope,      category: 'Medical' },
  { label: 'Clinical Cases',       view: 'clinical',     description: 'Solve realistic patient cases', icon: Stethoscope,          category: 'Medical' },
  { label: 'AI Diagnosis',         view: 'diagnosis',    description: 'Symptom-to-disease AI engine', icon: Stethoscope,           category: 'Medical' },
  { label: 'Disease Database',     view: 'diseasedb',    description: 'Browse, search diseases, symptoms, causes', icon: Bug,      category: 'Discovery' },
  { label: 'Drug Candidates',      view: 'drugcandidate',description: 'Find potential cures, drug-target interactions', icon: Bug, category: 'Discovery' },
  { label: 'Research Hub',         view: 'research',     description: 'PubMed summaries, latest science papers', icon: BookOpen,   category: 'Discovery' },
  { label: 'Genomics Explorer',    view: 'genomics',     description: 'DNA sequences, gene expression, SNPs', icon: Dna,           category: 'Discovery' },
  { label: 'Knowledge Base',       view: 'kb',           description: 'Curated articles across all subjects', icon: BookOpen,      category: 'Learn' },
  { label: 'Quiz Mode',            view: 'quiz',         description: 'Test your knowledge interactively', icon: BookOpen,         category: 'Learn' },
  { label: 'Flashcards',           view: 'flashcards',   description: 'Spaced repetition learning cards', icon: BookOpen,         category: 'Learn' },
  { label: 'Calculators Hub',      view: 'tools',        description: 'Molarity, Hardy-Weinberg, pH, and more', icon: BookOpen,    category: 'Learn' },
]

export default function SearchModal() {
  const { searchOpen, setSearchOpen, setModule } = useAppStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.length >= 1
    ? SEARCH_INDEX.filter(r =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : SEARCH_INDEX.slice(0, 6)

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100)
    else setQuery('')
  }, [searchOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !searchOpen) { e.preventDefault(); setSearchOpen(true) }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [searchOpen])

  if (!searchOpen) return null

  const categoryColors: Record<string, string> = {
    Biology: '#10b981', Chemistry: '#f59e0b', Physics: '#22d3ee',
    Medical: '#ef4444', Discovery: '#a855f7', Learn: '#3b82f6',
  }

  return (
    <div className="modal-backdrop" onClick={() => setSearchOpen(false)}>
      <div
        className="modal-box fade-in"
        style={{ maxWidth: 580 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Search size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search modules, topics, tools..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: '1rem', color: 'var(--text-primary)',
            }}
          />
          <button className="btn btn-ghost" style={{ padding: '0.2rem' }} onClick={() => setSearchOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          {query.length < 1 && (
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Quick access</p>
          )}
          {results.map((r) => (
            <div
              key={r.view}
              onClick={() => { setModule(r.view); setSearchOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.6rem 0.5rem', borderRadius: '0.5rem', cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '0.5rem', flexShrink: 0,
                background: `${categoryColors[r.category] ?? '#22d3ee'}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <r.icon size={16} style={{ color: categoryColors[r.category] ?? 'var(--accent)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description}</div>
              </div>
              <span style={{ fontSize: '0.65rem', color: categoryColors[r.category], background: `${categoryColors[r.category]}18`, padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                {r.category}
              </span>
            </div>
          ))}
          {results.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1.5rem' }}>
              No results for "{query}"
            </p>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.75rem', paddingTop: '0.5rem', display: 'flex', gap: '1rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          <span><kbd style={{ fontFamily: 'monospace', background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 3 }}>↵</kbd> Select</span>
          <span><kbd style={{ fontFamily: 'monospace', background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 3 }}>Esc</kbd> Close</span>
          <span><kbd style={{ fontFamily: 'monospace', background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 3 }}>/</kbd> Open</span>
        </div>
      </div>
    </div>
  )
}
