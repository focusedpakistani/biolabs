import { useRef, useEffect, useState } from 'react'
import { Info, Atom } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

// Sample molecules for the viewer
const SAMPLE_MOLECULES = [
  {
    id: 'aspirin',
    label: 'Aspirin (C₉H₈O₄)',
    smiles: 'CC(=O)Oc1ccccc1C(=O)O',
    color: '#22d3ee',
  },
  {
    id: 'caffeine',
    label: 'Caffeine (C₈H₁₀N₄O₂)',
    smiles: 'Cn1cnc2c1c(=O)n(c(=O)n2C)C',
    color: '#10b981',
  },
  {
    id: 'glucose',
    label: 'Glucose (C₆H₁₂O₆)',
    smiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O',
    color: '#f59e0b',
  },
  {
    id: 'dopamine',
    label: 'Dopamine (C₈H₁₁NO₂)',
    smiles: 'NCCc1ccc(O)c(O)c1',
    color: '#a855f7',
  },
  {
    id: 'atp',
    label: 'ATP (C₁₀H₁₆N₅O₁₃P₃)',
    smiles:
      'Nc1ncnc2c1ncn2[C@@H]1O[C@H](COP(=O)(O)OP(=O)(O)OP(=O)(O)O)[C@@H](O)[C@H]1O',
    color: '#ef4444',
  },
  {
    id: 'cholesterol',
    label: 'Cholesterol (C₂₇H₄₆O)',
    smiles:
      '[C@@H]1(CC[C@H]2[C@@]1(CC[C@]3([C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C)C)C(C)C',
    color: '#f59e0b',
  },
]

const ATOM_COLORS: Record<string, string> = {
  H: '#ffffff',
  C: '#404040',
  N: '#4444ff',
  O: '#ff4444',
  S: '#ffff00',
  P: '#ff8800',
  F: '#00ff00',
  Cl: '#00cc00',
}

const ATOM_SIZES: Record<string, number> = {
  H: 8,
  C: 14,
  N: 13,
  O: 12,
  S: 16,
  P: 15,
  F: 10,
  Cl: 14,
}

type ProjectedAtom = {
  x: number
  y: number
  z: number
  scale: number
  atomIndex: number
}

// Canvas-based molecule visualization
function MolCanvas({ smiles }: { smiles: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const angleRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    let width = 0
    let height = 0
    let isDisposed = false

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      width = rect.width
      height = rect.height

      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resizeCanvas()

    // Simplified SMILES atom extraction for the fallback visualization.
    // This is a visual approximation, not a complete chemical parser.
    const atomSymbols: string[] = []
    let i = 0

    while (i < smiles.length) {
      const remaining = smiles.slice(i)

      // Ignore bracket expressions such as [C@@H] as a single atom.
      if (remaining.startsWith('[')) {
        const closingBracket = remaining.indexOf(']')

        if (closingBracket !== -1) {
          const bracketContent = remaining.slice(1, closingBracket)
          const atomMatch = bracketContent.match(/^(Cl|Br|[A-Z][a-z]?)/)

          if (atomMatch) {
            atomSymbols.push(atomMatch[1])
          }

          i += closingBracket + 1
          continue
        }
      }

      const match = remaining.match(/^(Cl|Br|[A-Z][a-z]?)/)

      if (match) {
        atomSymbols.push(match[1])
        i += match[1].length
      } else {
        i++
      }
    }

    const symbols = atomSymbols.slice(0, 20)
    const atomCount = symbols.length

    const atoms = symbols.map((symbol, index) => ({
      symbol,
      x: Math.cos(index * 1.1) * (30 + index * 4),
      y: Math.sin(index * 1.3) * (30 + index * 4),
      z: (index - atomCount / 2) * 8,
    }))

    // Connect consecutive atoms for a simplified fallback display.
    const bonds: [number, number][] = []

    for (let index = 0; index < atomCount - 1; index++) {
      bonds.push([index, index + 1])
    }

    const draw = () => {
      if (isDisposed) return

      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2

      angleRef.current += 0.012
      const angle = angleRef.current

      const projected: ProjectedAtom[] = atoms.map((atom, atomIndex) => {
        const rotatedX =
          atom.x * Math.cos(angle) - atom.z * Math.sin(angle)

        const rotatedZ =
          atom.x * Math.sin(angle) + atom.z * Math.cos(angle)

        const fieldOfView = 300
        const scale = fieldOfView / (fieldOfView + rotatedZ + 200)

        return {
          x: centerX + rotatedX * scale,
          y: centerY + atom.y * scale,
          z: rotatedZ,
          scale,
          atomIndex,
        }
      })

      // Draw bonds.
      bonds.forEach(([firstIndex, secondIndex]) => {
        const first = projected[firstIndex]
        const second = projected[secondIndex]

        if (!first || !second) return

        const firstAtom = atoms[firstIndex]
        const secondAtom = atoms[secondIndex]

        const gradient = ctx.createLinearGradient(
          first.x,
          first.y,
          second.x,
          second.y,
        )

        gradient.addColorStop(
          0,
          ATOM_COLORS[firstAtom.symbol] ?? '#888888',
        )

        gradient.addColorStop(
          1,
          ATOM_COLORS[secondAtom.symbol] ?? '#888888',
        )

        ctx.beginPath()
        ctx.moveTo(first.x, first.y)
        ctx.lineTo(second.x, second.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2.5 * first.scale
        ctx.globalAlpha = 0.7
        ctx.stroke()
        ctx.globalAlpha = 1
      })

      // Draw atoms from back to front.
      const sortedAtoms = [...projected].sort(
        (first, second) => first.z - second.z,
      )

      sortedAtoms.forEach((point) => {
        const atom = atoms[point.atomIndex]

        if (!atom) return

        const color = ATOM_COLORS[atom.symbol] ?? '#aaaaaa'
        const radius = (ATOM_SIZES[atom.symbol] ?? 12) * point.scale

        const gradient = ctx.createRadialGradient(
          point.x - radius * 0.3,
          point.y - radius * 0.3,
          Math.max(0.1, radius * 0.1),
          point.x,
          point.y,
          radius,
        )

        gradient.addColorStop(0, `${color}ff`)
        gradient.addColorStop(1, `${color}44`)

        ctx.beginPath()
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.font = `bold ${Math.max(8, 10 * point.scale)}px monospace`
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        if (radius > 8) {
          ctx.fillText(atom.symbol, point.x, point.y)
        }
      })

      animRef.current = requestAnimationFrame(draw)
    }

    const resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(canvas)

    draw()

    return () => {
      isDisposed = true
      resizeObserver.disconnect()

      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current)
      }
    }
  }, [smiles])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'grab',
        display: 'block',
      }}
      aria-label="Animated molecule visualization"
      role="img"
    />
  )
}

export default function MolViewer3D() {
  const { level } = useAppStore()

  const [selected, setSelected] = useState(SAMPLE_MOLECULES[0])
  const [customSmiles, setCustomSmiles] = useState('')
  const [activeSmiles, setActiveSmiles] = useState(
    SAMPLE_MOLECULES[0].smiles,
  )
  const [showInfo, setShowInfo] = useState(false)

  const molInfo: Record<string, { desc: string; use: string }> = {
    aspirin: {
      desc: 'Acetylsalicylic acid — analgesic and anti-inflammatory.',
      use: 'Pain relief, fever, blood thinning (anti-platelet).',
    },
    caffeine: {
      desc: 'Methylxanthine alkaloid — CNS stimulant.',
      use: 'Alertness, coffee/tea constituent, adenosine receptor antagonist.',
    },
    glucose: {
      desc: 'Simple sugar (monosaccharide) — cellular energy currency.',
      use: 'Glycolysis, cellular respiration, brain function.',
    },
    dopamine: {
      desc: 'Catecholamine neurotransmitter.',
      use: 'Reward, motivation, motor control, Parkinson\'s disease.',
    },
    atp: {
      desc: 'Adenosine triphosphate — universal energy currency.',
      use: 'Powers muscle contraction, biosynthesis, active transport.',
    },
    cholesterol: {
      desc: 'Sterol lipid, membrane component.',
      use: 'Cell membrane structure, steroid hormone precursor, bile salt.',
    },
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            marginBottom: '0.25rem',
          }}
        >
          <span className="gradient-text">3D Molecule Viewer</span>
        </h2>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
          }}
        >
          Explore 3D molecular structures with rotating atom-bond models.{' '}
          {level === 'K12'
            ? 'See how atoms stick together!'
            : 'Analyze bonding geometry and spatial configuration.'}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 320px',
          gap: '1.5rem',
        }}
      >
        {/* Molecule canvas */}
        <div
          className="viewer-3d"
          style={{
            height: 480,
            minWidth: 0,
            position: 'relative',
          }}
        >
          <MolCanvas smiles={activeSmiles} />

          {/* Information toggle */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              display: 'flex',
              gap: '0.4rem',
            }}
          >
            <button
              className="btn btn-secondary"
              style={{
                padding: '0.4rem',
                fontSize: '0.72rem',
              }}
              title="Info"
              aria-label="Toggle molecule information"
              aria-pressed={showInfo}
              onClick={() => setShowInfo((previous) => !previous)}
            >
              <Info size={14} />
            </button>
          </div>

          {/* Canvas labels */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                background: 'rgba(0,0,0,0.6)',
                padding: '0.3rem 0.6rem',
                borderRadius: '0.4rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#ffffff',
                  fontWeight: 700,
                }}
              >
                {selected.label}
              </span>
            </div>

            <div
              style={{
                background: 'rgba(0,0,0,0.6)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.4rem',
                backdropFilter: 'blur(8px)',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
              }}
            >
              Auto-rotating
            </div>
          </div>
        </div>

        {/* Controls panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            minWidth: 0,
          }}
        >
          {/* Molecule selector */}
          <div
            className="surface-elevated"
            style={{ padding: '1rem' }}
          >
            <h4
              style={{
                fontWeight: 700,
                fontSize: '0.875rem',
                marginBottom: '0.75rem',
              }}
            >
              <Atom
                size={15}
                style={{
                  display: 'inline',
                  marginRight: 4,
                  color: 'var(--accent)',
                }}
              />
              Select Molecule
            </h4>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              {SAMPLE_MOLECULES.map((molecule) => (
                <button
                  type="button"
                  key={molecule.id}
                  onClick={() => {
                    setSelected(molecule)
                    setActiveSmiles(molecule.smiles)
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    border: `1px solid ${
                      selected.id === molecule.id
                        ? molecule.color
                        : 'var(--border)'
                    }`,
                    background:
                      selected.id === molecule.id
                        ? `${molecule.color}12`
                        : 'transparent',
                    color:
                      selected.id === molecule.id
                        ? molecule.color
                        : 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight:
                      selected.id === molecule.id ? 700 : 500,
                    transition: 'all 0.15s',
                  }}
                  aria-pressed={selected.id === molecule.id}
                >
                  {molecule.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom SMILES */}
          <div
            className="surface-elevated"
            style={{ padding: '1rem' }}
          >
            <h4
              style={{
                fontWeight: 700,
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
              }}
            >
              Custom SMILES
            </h4>

            <textarea
              className="input"
              rows={3}
              placeholder="Enter SMILES string..."
              value={customSmiles}
              onChange={(event) => setCustomSmiles(event.target.value)}
              style={{
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                resize: 'vertical',
              }}
            />

            <button
              type="button"
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.5rem',
                fontSize: '0.8rem',
              }}
              onClick={() => {
                const smiles = customSmiles.trim()

                if (smiles) {
                  setActiveSmiles(smiles)
                }
              }}
            >
              Render Molecule
            </button>
          </div>

          {/* Molecule information */}
          {showInfo && molInfo[selected.id] && (
            <div
              className="surface-elevated"
              style={{ padding: '1rem' }}
            >
              <h4
                style={{
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  color: selected.color,
                }}
              >
                ℹ️ About {selected.label.split('(')[0]}
              </h4>

              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.4rem',
                }}
              >
                {molInfo[selected.id].desc}
              </p>

              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                }}
              >
                <strong>Uses:</strong> {molInfo[selected.id].use}
              </p>
            </div>
          )}

          {/* Atom color legend */}
          <div
            className="surface"
            style={{ padding: '0.75rem' }}
          >
            <h4
              style={{
                fontWeight: 700,
                fontSize: '0.78rem',
                marginBottom: '0.5rem',
              }}
            >
              Atom Color Legend
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.3rem',
              }}
            >
              {Object.entries(ATOM_COLORS).map(([symbol, color]) => (
                <div
                  key={symbol}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.72rem',
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: color,
                      border: '1px solid rgba(255,255,255,0.2)',
                      flexShrink: 0,
                    }}
                  />

                  <span style={{ color: 'var(--text-secondary)' }}>
                    {symbol}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
