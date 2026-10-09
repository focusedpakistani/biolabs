import { useRef, useEffect, useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { Play, Pause, RotateCcw, Info } from 'lucide-react'

// 3D DNA Double Helix rendered on Canvas
// Uses parametric equations for the helix + base pairs

const BASE_COLORS: Record<string, string> = { A: '#ef4444', T: '#3b82f6', G: '#f59e0b', C: '#10b981', U: '#a855f7' }
const COMPLEMENTS: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G', U: 'A' }
const SEQUENCE = 'ATGCGCATTAGCATGCGATCGATCGATCGAGCTATCGATCGATCG'

function generateSequence(len = 40) {
  const bases = ['A','T','G','C']
  return Array.from({ length: len }, () => bases[Math.floor(Math.random() * bases.length)]).join('')
}

export default function DNA3D() {
  const { level } = useAppStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const angleRef = useRef(0)
  const [playing, setPlaying] = useState(true)
  const [sequence, setSequence] = useState(SEQUENCE)
  const [hoveredBase, setHoveredBase] = useState<string | null>(null)
  const [mode, setMode] = useState<'dna' | 'rna'>('dna')
  const [zoom, setZoom] = useState(1)
  const [mutate, setMutate] = useState(false)
  const [mutatedSeq, setMutatedSeq] = useState(sequence)

  useEffect(() => {
    if (mutate) {
      const arr = sequence.split('')
      const i = Math.floor(Math.random() * arr.length)
      const bases = ['A', 'T', 'G', 'C']
      arr[i] = bases[Math.floor(Math.random() * bases.length)]
      setMutatedSeq(arr.join(''))
    } else setMutatedSeq(sequence)
  }, [mutate, sequence])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf: number
    const ctx = canvas.getContext('2d')!

    function resize() {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }
    resize()
    window.addEventListener('resize', resize)

    const displaySeq = mutate ? mutatedSeq : sequence
    const seq = displaySeq.slice(0, 30)

    function draw() {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Background gradient
      const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H))
      bg.addColorStop(0, 'rgba(13,30,55,0.9)')
      bg.addColorStop(1, 'rgba(6,13,26,1)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      const a = angleRef.current
      const N = seq.length
      const helixR = 55 * zoom
      const pitch  = (H * 0.8) / N
      const startY = H * 0.1

      // Draw base pairs and strands
      for (let j = 0; j < N; j++) {
        const t = (j / N) * Math.PI * 4 + a
        const y = startY + j * pitch

        const x1 = W/2 + Math.cos(t) * helixR
        const z1 =       Math.sin(t) * helixR
        const x2 = W/2 + Math.cos(t + Math.PI) * helixR
        const z2 =       Math.sin(t + Math.PI) * helixR

        const depth1 = (z1 + helixR) / (2 * helixR)
        const depth2 = (z2 + helixR) / (2 * helixR)

        const base1 = mode === 'rna' && seq[j] === 'T' ? 'U' : seq[j]
        const base2 = COMPLEMENTS[base1] ?? 'T'
        const col1  = BASE_COLORS[base1] ?? '#888'
        const col2  = BASE_COLORS[base2] ?? '#888'

        // Base pair connector
        const grd = ctx.createLinearGradient(x1, y, x2, y)
        grd.addColorStop(0,   col1 + 'aa')
        grd.addColorStop(0.5, '#ffffff33')
        grd.addColorStop(1,   col2 + 'aa')
        ctx.beginPath()
        ctx.moveTo(x1, y)
        ctx.lineTo(x2, y)
        ctx.strokeStyle = grd
        ctx.lineWidth = 2 * zoom
        ctx.globalAlpha = 0.6
        ctx.stroke()
        ctx.globalAlpha = 1

        // Nucleotide 1
        const r1 = (7 + depth1 * 5) * zoom
        const g1 = ctx.createRadialGradient(x1 - r1*0.3, y - r1*0.3, r1*0.1, x1, y, r1)
        g1.addColorStop(0, col1)
        g1.addColorStop(1, col1 + '44')
        ctx.beginPath()
        ctx.arc(x1, y, r1, 0, Math.PI*2)
        ctx.fillStyle = g1
        ctx.fill()
        ctx.font = `bold ${Math.max(8, 9*zoom)}px monospace`
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        if (r1 > 8) ctx.fillText(base1, x1, y)

        // Nucleotide 2
        const r2 = (7 + depth2 * 5) * zoom
        const g2 = ctx.createRadialGradient(x2 - r2*0.3, y - r2*0.3, r2*0.1, x2, y, r2)
        g2.addColorStop(0, col2)
        g2.addColorStop(1, col2 + '44')
        ctx.beginPath()
        ctx.arc(x2, y, r2, 0, Math.PI*2)
        ctx.fillStyle = g2
        ctx.fill()
        if (r2 > 8) { ctx.fillStyle = '#fff'; ctx.fillText(base2, x2, y) }
      }

      // Sugar-phosphate backbone (splines)
      for (let strand = 0; strand < 2; strand++) {
        ctx.beginPath()
        let first = true
        for (let j = 0; j < N; j++) {
          const t = (j / N) * Math.PI * 4 + a + strand * Math.PI
          const y = startY + j * pitch
          const x = W/2 + Math.cos(t) * (helixR + 12*zoom)
          if (first) { ctx.moveTo(x, y); first = false }
          else ctx.lineTo(x, y)
        }
        const sg = ctx.createLinearGradient(W/2 - helixR, 0, W/2 + helixR, H)
        sg.addColorStop(0, strand === 0 ? '#22d3ee' : '#10b981')
        sg.addColorStop(1, strand === 0 ? '#0891b2' : '#059669')
        ctx.strokeStyle = sg
        ctx.lineWidth = 3.5 * zoom
        ctx.globalAlpha = 0.7
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      if (playing) {
        angleRef.current += 0.018
        raf = requestAnimationFrame(draw)
      }
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [playing, sequence, mutate, mutatedSeq, mode, zoom])

  // Trigger redraw when paused + controls change
  useEffect(() => {
    if (!playing) {
      const canvas = canvasRef.current
      if (!canvas) return
      // Trigger single frame by momentarily re-running draw logic
    }
  }, [zoom])

  const levelInfo: Record<string, string> = {
    K12:      '🧬 DNA is like a twisted ladder! Each rung is made of colored letters (A,T,G,C) that form pairs.',
    undergrad:'DNA double helix: antiparallel strands with Watson-Crick base pairing (A-T, G-C). Major/minor grooves exposed.',
    grad:     'B-form DNA helix, ~10.5 bp/turn, rise 3.4 Å/bp. Base stacking provides ~40% of helix stability.',
    phd:      'Double helix topology: Lk = Tw + Wr. Superhelical density σ = (Lk − Lk₀)/Lk₀. Key for replication and transcription mechanics.',
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
          <span className="gradient-text">3D DNA / RNA Helix</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{levelInfo[level] ?? levelInfo.undergrad}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        <div className="viewer-3d" style={{ height: 520, position: 'relative' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          {/* Overlay controls */}
          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setPlaying(!playing)}>
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => { angleRef.current = 0 }}>
              <RotateCcw size={14} />
            </button>
            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setZoom(z => Math.min(2, z + 0.2))}>+</button>
            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}>−</button>
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.6)', padding: '0.35rem 0.6rem', borderRadius: '0.4rem', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 700 }}>
              {mode.toUpperCase()} · {(sequence.length)} bp
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Mode */}
          <div className="surface-elevated" style={{ padding: '1rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>Molecule Type</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {(['dna','rna'] as const).map(m => (
                <button key={m} className={`btn ${mode === m ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'center', fontSize: '0.8rem' }} onClick={() => setMode(m)}>
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Sequence input */}
          <div className="surface-elevated" style={{ padding: '1rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Sequence (5'→3')</h4>
            <textarea
              className="input"
              rows={3}
              value={sequence}
              onChange={e => setSequence(e.target.value.toUpperCase().replace(/[^ATGCU]/g,'').slice(0,50))}
              style={{ fontSize: '0.8rem', fontFamily: 'monospace', resize: 'vertical' }}
            />
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.4rem', fontSize: '0.78rem' }} onClick={() => setSequence(generateSequence(40))}>
              🎲 Random Sequence
            </button>
          </div>

          {/* Mutation */}
          <div className="surface-elevated" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.875rem' }}>Point Mutation</h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <div
                  onClick={() => setMutate(!mutate)}
                  style={{
                    width: 40, height: 22, borderRadius: 11, position: 'relative', cursor: 'pointer',
                    background: mutate ? 'var(--accent)' : 'var(--bg-tertiary)',
                    border: '1px solid var(--border)', transition: 'background 0.2s',
                  }}
                >
                  <div style={{ position: 'absolute', top: 2, left: mutate ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </div>
              </label>
            </div>
            {mutate && (
              <p style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>
                ⚠️ SNP introduced at position {Math.floor(Math.random() * sequence.length) + 1}
              </p>
            )}
          </div>

          {/* Legend */}
          <div className="surface" style={{ padding: '0.75rem' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.5rem' }}>Base Pair Legend</h4>
            {[['A','T','Adenine–Thymine'],['G','C','Guanine–Cytosine'],['U','A','Uracil–Adenine (RNA)']].map(([b1,b2,name]) => (
              <div key={b1} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', fontSize: '0.72rem' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: BASE_COLORS[b1] }} />
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{b1}</span>
                <span style={{ color: 'var(--text-muted)' }}>—</span>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: BASE_COLORS[b2] }} />
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{b2}</span>
                <span style={{ color: 'var(--text-muted)' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
