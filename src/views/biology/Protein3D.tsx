import { useRef, useEffect, useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { Play, Pause, RotateCcw, ZoomIn } from 'lucide-react'

// Protein 3D viewer using canvas-based sphere rendering
// Simulates a real folded protein structure

interface Residue {
  name: string; chain: string; x: number; y: number; z: number; type: 'helix' | 'sheet' | 'coil'
}

const AA_COLORS: Record<string, string> = {
  helix: '#ff6b6b', sheet: '#4ecdc4', coil: '#ffe66d',
  hydrophobic: '#f59e0b', polar: '#22d3ee', charged: '#a855f7',
}

const AMINO_ACIDS = ['GLY','ALA','VAL','LEU','ILE','SER','THR','CYS','MET','PHE','TYR','TRP','LYS','ARG','HIS','ASP','GLU','ASN','GLN','PRO']

function generateProtein(numResidues = 80): Residue[] {
  const residues: Residue[] = []
  let x = 0, y = 0, z = 0
  let type: 'helix' | 'sheet' | 'coil' = 'helix'
  let segLen = 0, segMax = Math.floor(Math.random() * 8 + 5)

  for (let i = 0; i < numResidues; i++) {
    if (segLen++ >= segMax) {
      segLen = 0; segMax = Math.floor(Math.random() * 8 + 5)
      type = (['helix','sheet','coil'] as const)[Math.floor(Math.random() * 3)]
    }
    const aa = AMINO_ACIDS[Math.floor(Math.random() * AMINO_ACIDS.length)]
    if (type === 'helix') {
      const ang = i * 1.74
      x += Math.cos(ang) * 1.5 + 0.5
      y += Math.sin(ang) * 1.5
      z += 1.5
    } else if (type === 'sheet') {
      x += (i % 2 === 0 ? 3 : -3) * 0.5
      y += 0.5
      z += 3.3
    } else {
      x += (Math.random() - 0.5) * 4
      y += (Math.random() - 0.5) * 4
      z += (Math.random() - 0.5) * 4
    }
    residues.push({ name: aa, chain: 'A', x, y, z, type })
  }
  return residues
}

const PROTEINS = [
  { id: 'hemoglobin', label: 'Hemoglobin', desc: 'Oxygen transport protein in red blood cells', residues: 80 },
  { id: 'insulin',    label: 'Insulin',    desc: 'Blood glucose regulatory hormone', residues: 51 },
  { id: 'antibody',   label: 'IgG Antibody', desc: 'Y-shaped immune defense protein', residues: 90 },
  { id: 'collagen',   label: 'Collagen',   desc: 'Triple-helix structural protein', residues: 70 },
  { id: 'p53',        label: 'p53 Tumor Suppressor', desc: 'Guardian of the genome', residues: 85 },
]

export default function Protein3D() {
  const { level } = useAppStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const angleRef  = useRef({ x: 0.3, y: 0 })
  const [playing, setPlaying] = useState(true)
  const [selectedProtein, setSelectedProtein] = useState(PROTEINS[0])
  const [residues, setResidues] = useState<Residue[]>(() => generateProtein(80))
  const [colorMode, setColorMode] = useState<'structure' | 'hydrophobic'>('structure')
  const [showBackbone, setShowBackbone] = useState(true)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    setResidues(generateProtein(selectedProtein.residues))
  }, [selectedProtein])

  useEffect(() => {
    const canvasRefValue = canvasRef.current
    if (!canvasRefValue) return
    const canvas: HTMLCanvasElement = canvasRefValue
    const ctx = canvas.getContext('2d')!
    let raf: number

    function resize() {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
    }
    resize()
    window.addEventListener('resize', resize)

    function project(x: number, y: number, z: number) {
      const ax = angleRef.current.x, ay = angleRef.current.y
      const W = canvas.width, H = canvas.height
      // Rotate around Y then X
      const rx = x * Math.cos(ay) - z * Math.sin(ay)
      const rz = x * Math.sin(ay) + z * Math.cos(ay)
      const ry = y * Math.cos(ax) - rz * Math.sin(ax)
      const rzz = y * Math.sin(ax) + rz * Math.cos(ax)
      const scale = zoom * Math.min(W, H) * 0.014
      const fov = 350
      const sf  = fov / (fov + rzz)
      return { px: W/2 + rx * scale * sf, py: H/2 + ry * scale * sf, z: rzz, sf }
    }

    function draw() {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // BG
      const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H))
      bg.addColorStop(0, 'rgba(15,30,55,1)'); bg.addColorStop(1, 'rgba(6,13,26,1)')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

      // Backbone
      if (showBackbone) {
        ctx.beginPath()
        residues.forEach((r, i) => {
          const p = project(r.x, r.y, r.z)
          if (i === 0) ctx.moveTo(p.px, p.py)
          else ctx.lineTo(p.px, p.py)
        })
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.lineWidth = 1.5
        ctx.lineJoin = 'round'
        ctx.stroke()
      }

      // Residues (depth-sorted)
      const projected = residues.map((r, i) => ({ ...project(r.x, r.y, r.z), r, i }))
      projected.sort((a, b) => a.z - b.z)

      projected.forEach(({ px, py, sf, r }) => {
        const col = colorMode === 'structure' ? (AA_COLORS[r.type] ?? '#888') : (r.name.match(/LEU|ILE|VAL|PHE|TRP|MET|ALA/) ? AA_COLORS.hydrophobic : r.name.match(/LYS|ARG|ASP|GLU|HIS/) ? AA_COLORS.charged : AA_COLORS.polar)
        const radius = Math.max(3, 7 * sf * zoom)
        const grd = ctx.createRadialGradient(px - radius*0.3, py - radius*0.3, radius*0.1, px, py, radius)
        grd.addColorStop(0, col + 'ff')
        grd.addColorStop(0.6, col + 'bb')
        grd.addColorStop(1, col + '22')
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
        if (radius > 10) {
          ctx.font = `bold ${Math.max(6, 8*sf*zoom)}px monospace`
          ctx.fillStyle = 'rgba(0,0,0,0.7)'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(r.name.slice(0,3), px, py)
        }
      })

      if (playing) angleRef.current.y += 0.012
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [playing, residues, colorMode, showBackbone, zoom])

  const levelInfo: Record<string, string> = {
    K12:      '🔮 Proteins are made of tiny building blocks called amino acids — they fold up like origami to do their job!',
    undergrad:'Primary (sequence) → Secondary (α-helix, β-sheet) → Tertiary (3D fold) → Quaternary structure.',
    grad:     'Protein folding determined by hydrophobic core burial, H-bonding, disulfide bridges. Anfinsen\'s dogma: sequence → structure.',
    phd:      'Free energy landscape of folding, Ramachandran plot constraints (φ/ψ angles). MD simulations, AlphaFold2 E(MSA) = contact prediction.',
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}><span className="gradient-text">3D Protein Structure Viewer</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{levelInfo[level] ?? levelInfo.undergrad}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Canvas */}
        <div className="viewer-3d" style={{ height: 520, position: 'relative' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setPlaying(!playing)}>
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}>
              <ZoomIn size={14} />
            </button>
            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setZoom(z => Math.max(0.4, z - 0.2))}>
              <ZoomIn size={14} style={{ transform: 'scaleX(-1)' }} />
            </button>
            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => { setResidues(generateProtein(selectedProtein.residues)); angleRef.current = { x: 0.3, y: 0 } }}>
              <RotateCcw size={14} />
            </button>
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {Object.entries(AA_COLORS).filter(([k]) => ['helix','sheet','coil'].includes(k)).map(([type, col]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(0,0,0,0.6)', padding: '0.25rem 0.5rem', borderRadius: '0.4rem', backdropFilter: 'blur(8px)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col }} />
                <span style={{ fontSize: '0.65rem', color: '#fff', textTransform: 'capitalize' }}>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="surface-elevated" style={{ padding: '1rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>Select Protein</h4>
            {PROTEINS.map(p => (
              <div key={p.id} onClick={() => setSelectedProtein(p)} style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', marginBottom: '0.3rem', border: `1px solid ${selectedProtein.id === p.id ? 'var(--accent)' : 'var(--border)'}`, background: selectedProtein.id === p.id ? 'var(--accent-glow)' : 'transparent', transition: 'all 0.15s' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: selectedProtein.id === p.id ? 'var(--accent)' : 'var(--text-primary)' }}>{p.label}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.desc}</div>
              </div>
            ))}
          </div>

          <div className="surface-elevated" style={{ padding: '1rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Color Mode</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {(['structure','hydrophobic'] as const).map(m => (
                <button key={m} className={`btn ${colorMode === m ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'center', fontSize: '0.75rem' }} onClick={() => setColorMode(m)}>
                  {m === 'structure' ? '🎨 Structure' : '💧 Hydro'}
                </button>
              ))}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', cursor: 'pointer', fontSize: '0.8rem' }}>
              <input type="checkbox" checked={showBackbone} onChange={e => setShowBackbone(e.target.checked)} />
              Show Backbone
            </label>
          </div>

          <div className="surface" style={{ padding: '0.75rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.4rem' }}>Stats</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span>Residues: <strong style={{ color: 'var(--accent)' }}>{residues.length}</strong></span>
              <span>α-helices: <strong style={{ color: AA_COLORS.helix }}>{residues.filter(r => r.type === 'helix').length} aa</strong></span>
              <span>β-sheets: <strong style={{ color: AA_COLORS.sheet }}>{residues.filter(r => r.type === 'sheet').length} aa</strong></span>
              <span>Coils: <strong style={{ color: AA_COLORS.coil }}>{residues.filter(r => r.type === 'coil').length} aa</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
