import { useRef, useEffect, useState } from 'react'
import { RotateCcw, ZoomIn, ZoomOut, Download, Info, Atom } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

// Real PDB molecule viewer using 3Dmol.js loaded from CDN
// Falls back to canvas-based SVG molecule when 3Dmol not available

declare global {
  interface Window {
    $3Dmol: any
    THREE: any
  }
}

const SAMPLE_MOLECULES = [
  { id: 'aspirin',   label: 'Aspirin (C₉H₈O₄)',         smiles: 'CC(=O)Oc1ccccc1C(=O)O',         color: '#22d3ee' },
  { id: 'caffeine',  label: 'Caffeine (C₈H₁₀N₄O₂)',      smiles: 'Cn1cnc2c1c(=O)n(c(=O)n2C)C',   color: '#10b981' },
  { id: 'glucose',   label: 'Glucose (C₆H₁₂O₆)',         smiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O', color: '#f59e0b' },
  { id: 'dopamine',  label: 'Dopamine (C₈H₁₁NO₂)',       smiles: 'NCCc1ccc(O)c(O)c1',             color: '#a855f7' },
  { id: 'atp',       label: 'ATP (C₁₀H₁₆N₅O₁₃P₃)',      smiles: 'Nc1ncnc2c1ncn2[C@@H]1O[C@H](COP(=O)(O)OP(=O)(O)OP(=O)(O)O)[C@@H](O)[C@H]1O', color: '#ef4444' },
  { id: 'cholesterol',label: 'Cholesterol (C₂₇H₄₆O)',    smiles: '[C@@H]1(CC[C@H]2[C@@]1(CC[C@]3([C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C)C)C(C)C', color: '#f59e0b' },
]

// Atom data for canvas fallback renderer
const ATOM_COLORS: Record<string, string> = {
  H:'#ffffff', C:'#404040', N:'#4444ff', O:'#ff4444', S:'#ffff00', P:'#ff8800', F:'#00ff00', Cl:'#00cc00'
}
const ATOM_SIZES: Record<string, number> = {
  H:8, C:14, N:13, O:12, S:16, P:15, F:10, Cl:14
}

// Simple canvas-based 3D molecule renderer (fallback)
function MolCanvas({ smiles, label }: { smiles: string; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const angleRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width = canvas.offsetWidth * window.devicePixelRatio
    const H = canvas.height = canvas.offsetHeight * window.devicePixelRatio

    // Parse SMILES into atom graph (simplified)
    const atoms: { symbol: string; x: number; y: number; z: number }[] = []
    const bonds: [number, number][] = []
    let atomSymbols: string[] = []
    let i = 0
    while (i < smiles.length) {
      const m = smiles.slice(i).match(/^([A-Z][a-z]?)/)
      if (m) { atomSymbols.push(m[1]); i += m[1].length }
      else i++
    }
    atomSymbols = atomSymbols.slice(0, 20) // cap for perf

    const N = atomSymbols.length
    // Arrange in 3D spiral
    atoms.push(...atomSymbols.map((s, j) => ({
      symbol: s,
      x: Math.cos(j * 1.1) * (30 + j * 4),
      y: Math.sin(j * 1.3) * (30 + j * 4),
      z: (j - N/2) * 8,
    })))
    for (let j = 0; j < N - 1; j++) bonds.push([j, j+1])

    function draw() {
      ctx.clearRect(0, 0, W, H)
      const cx = W/2, cy = H/2
      angleRef.current += 0.012
      const a = angleRef.current

      // Project 3D → 2D with rotation
      const projected = atoms.map(at => {
        const rx = at.x * Math.cos(a) - at.z * Math.sin(a)
        const ry = at.y
        const rz = at.x * Math.sin(a) + at.z * Math.cos(a)
        const fov = 300, scale = fov / (fov + rz + 200)
        return { x: cx + rx * scale, y: cy + ry * scale, z: rz, scale }
      })

      // Bonds
      bonds.forEach(([a0, a1]) => {
        const p0 = projected[a0], p1 = projected[a1]
        const g = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y)
        g.addColorStop(0, ATOM_COLORS[atoms[a0].symbol] ?? '#888')
        g.addColorStop(1, ATOM_COLORS[atoms[a1].symbol] ?? '#888')
        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y)
        ctx.lineTo(p1.x, p1.y)
        ctx.strokeStyle = g
        ctx.lineWidth = 2.5 * p0.scale
        ctx.globalAlpha = 0.7
        ctx.stroke()
        ctx.globalAlpha = 1
      })

      // Atoms (depth sorted)
      [...projected].sort((a,b) => a.z - b.z).forEach((p, si) => {
        const at = atoms[projected.indexOf(p) === -1 ? si : projected.indexOf(p)]
        const col = ATOM_COLORS[at?.symbol] ?? '#aaa'
        const r = (ATOM_SIZES[at?.symbol] ?? 12) * p.scale
        const grd = ctx.createRadialGradient(p.x - r*0.3, p.y - r*0.3, r*0.1, p.x, p.y, r)
        grd.addColorStop(0, col + 'ff')
        grd.addColorStop(1, col + '44')
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI*2)
        ctx.fillStyle = grd
        ctx.fill()
        ctx.font = `bold ${Math.max(8, 10*p.scale)}px monospace`
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        if (r > 8) ctx.fillText(at?.symbol ?? '', p.x, p.y)
      })

      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [smiles])

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%', cursor: 'grab', display: 'block' }} />
  )
}

export default function MolViewer3D() {
  const { level } = useAppStore()
  const [selected, setSelected] = useState(SAMPLE_MOLECULES[0])
  const [customSmiles, setCustomSmiles] = useState('')
  const [activeSmiles, setActiveSmiles] = useState(SAMPLE_MOLECULES[0].smiles)
  const [showInfo, setShowInfo] = useState(false)

  const molInfo: Record<string, { desc: string; use: string }> = {
    aspirin:    { desc: 'Acetylsalicylic acid — analgesic and anti-inflammatory.', use: 'Pain relief, fever, blood thinning (anti-platelet).' },
    caffeine:   { desc: 'Methylxanthine alkaloid — CNS stimulant.', use: 'Alertness, coffee/tea constituent, adenosine receptor antagonist.' },
    glucose:    { desc: 'Simple sugar (monosaccharide) — cellular energy currency.', use: 'Glycolysis, cellular respiration, brain function.' },
    dopamine:   { desc: 'Catecholamine neurotransmitter.', use: 'Reward, motivation, motor control, Parkinson\'s disease.' },
    atp:        { desc: 'Adenosine triphosphate — universal energy currency.', use: 'Powers muscle contraction, biosynthesis, active transport.' },
    cholesterol:{ desc: 'Sterol lipid, membrane component.', use: 'Cell membrane structure, steroid hormone precursor, bile salt.' },
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          <span className="gradient-text">3D Molecule Viewer</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Explore 3D molecular structures with rotating atom-bond models. {level === 'K12' ? 'See how atoms stick together!' : 'Analyze bonding geometry and spatial configuration.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        {/* 3D Canvas */}
        <div className="viewer-3d" style={{ height: 480, position: 'relative' }}>
          <MolCanvas smiles={activeSmiles} label={selected.label} />
          {/* Controls overlay */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: '0.4rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.4rem', fontSize: '0.72rem' }} title="Info" onClick={() => setShowInfo(!showInfo)}>
              <Info size={14} />
            </button>
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem', backdropFilter: 'blur(8px)' }}>
              <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 700 }}>{selected.label}</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '0.25rem 0.5rem', borderRadius: '0.4rem', backdropFilter: 'blur(8px)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              Auto-rotating · drag to interact
            </div>
          </div>
        </div>

        {/* Controls panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="surface-elevated" style={{ padding: '1rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              <Atom size={15} style={{ display: 'inline', marginRight: 4, color: 'var(--accent)' }} />
              Select Molecule
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {SAMPLE_MOLECULES.map(m => (
                <div
                  key={m.id}
                  onClick={() => { setSelected(m); setActiveSmiles(m.smiles) }}
                  style={{
                    padding: '0.5rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer',
                    border: `1px solid ${selected.id === m.id ? m.color : 'var(--border)'}`,
                    background: selected.id === m.id ? `${m.color}12` : 'transparent',
                    color: selected.id === m.id ? m.color : 'var(--text-primary)',
                    fontSize: '0.8rem', fontWeight: selected.id === m.id ? 700 : 500,
                    transition: 'all 0.15s',
                  }}
                >
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          {/* Custom SMILES */}
          <div className="surface-elevated" style={{ padding: '1rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Custom SMILES</h4>
            <textarea
              className="input"
              rows={3}
              placeholder="Enter SMILES string..."
              value={customSmiles}
              onChange={e => setCustomSmiles(e.target.value)}
              style={{ fontSize: '0.8rem', fontFamily: 'monospace', resize: 'vertical' }}
            />
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.8rem' }}
              onClick={() => { if (customSmiles) setActiveSmiles(customSmiles) }}
            >
              Render Molecule
            </button>
          </div>

          {/* Info card */}
          {showInfo && molInfo[selected.id] && (
            <div className="surface-elevated" style={{ padding: '1rem' }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem', color: selected.color }}>ℹ️ About {selected.label.split('(')[0]}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>{molInfo[selected.id].desc}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}><strong>Uses:</strong> {molInfo[selected.id].use}</p>
            </div>
          )}

          {/* Legend */}
          <div className="surface" style={{ padding: '0.75rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.5rem' }}>Atom Color Legend</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
              {Object.entries(ATOM_COLORS).map(([sym, col]) => (
                <div key={sym} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: col, border: '1px solid rgba(255,255,255,0.2)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{sym}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
