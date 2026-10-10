import { useState } from 'react'
import { Search, TestTube2, Zap, Pill, Target } from 'lucide-react'

interface Drug {
  id: string; name: string; target: string; disease: string; stage: string
  mechanism: string; status: string; company: string; type: string
  efficacy: number; safetyScore: number; description: string
  sideEffects: string[]; approvalYear?: number
}

const DRUGS: Drug[] = [
  {
    id: 'd1', name: 'Lecanemab (Leqembi)', target: 'Amyloid-β protofibrils', disease: "Alzheimer's",
    stage: 'FDA Approved', status: 'Approved 2023', company: 'Eisai/Biogen', type: 'Monoclonal Antibody',
    mechanism: 'Selectively binds and clears soluble amyloid-β aggregates, reducing plaque burden.',
    efficacy: 27, safetyScore: 72,
    description: 'First anti-amyloid antibody showing statistically significant slowing of cognitive decline (27% on CDR-SB).',
    sideEffects: ['ARIA-E (brain edema)', 'ARIA-H (microhemorrhage)', 'Headache', 'Infusion reactions'],
    approvalYear: 2023,
  },
  {
    id: 'd2', name: 'Sotorasib (Lumakras)', target: 'KRAS G12C', disease: 'Lung Cancer (NSCLC)',
    stage: 'FDA Approved', status: 'Approved 2021', company: 'Amgen', type: 'Small Molecule Covalent Inhibitor',
    mechanism: 'Irreversibly locks KRAS G12C in GDP-bound inactive state, blocking RAS-RAF-MAPK signaling.',
    efficacy: 37, safetyScore: 85,
    description: 'First-in-class covalent KRAS G12C inhibitor — breakthrough for previously undruggable KRAS.',
    sideEffects: ['Diarrhea', 'Nausea', 'Fatigue', 'Liver enzyme elevation', 'Musculoskeletal pain'],
    approvalYear: 2021,
  },
  {
    id: 'd3', name: 'Tirzepatide (Mounjaro)', target: 'GLP-1R + GIPR (dual agonist)', disease: 'Type 2 Diabetes / Obesity',
    stage: 'FDA Approved', status: 'Approved 2022', company: 'Eli Lilly', type: 'Peptide Dual Agonist',
    mechanism: 'Activates both GLP-1 and GIP receptors, enhancing insulin secretion, reducing glucagon, and suppressing appetite.',
    efficacy: 92, safetyScore: 88,
    description: 'Unprecedented ~20-22% body weight reduction. Outperforms semaglutide in head-to-head trials.',
    sideEffects: ['Nausea (common)', 'Vomiting', 'Diarrhea', 'Constipation', 'Rare: pancreatitis'],
    approvalYear: 2022,
  },
  {
    id: 'd4', name: 'Lenacapavir (Sunlenca)', target: 'HIV Capsid protein', disease: 'HIV/AIDS',
    stage: 'FDA Approved', status: 'Approved 2022', company: 'Gilead Sciences', type: 'Capsid Inhibitor',
    mechanism: 'Binds HIV-1 capsid at interface of capsid monomers, disrupting viral transport, integration, and assembly.',
    efficacy: 87, safetyScore: 91,
    description: 'First in class. Twice-yearly subcutaneous injection — removes daily pill burden. Potent against NRTI/NNRTI-resistant strains.',
    sideEffects: ['Injection site reactions', 'Nausea', 'Diarrhea', 'Generally well-tolerated'],
    approvalYear: 2022,
  },
  {
    id: 'd5', name: 'CAR-T GPC3 (Phase 2)', target: 'Glypican-3 (GPC3)', disease: 'Hepatocellular Carcinoma',
    stage: 'Phase 2', status: 'Clinical Trial', company: 'Multiple (NCI)', type: 'CAR-T Cell Therapy',
    mechanism: 'T-cells engineered with CAR directed at GPC3 overexpressed on HCC. Combines with anti-PD-1 checkpoint blockade.',
    efficacy: 48, safetyScore: 62,
    description: 'Novel cell therapy targeting GPC3+ liver cancer. Phase 2 showing ~40-50% response rate in combination.',
    sideEffects: ['Cytokine Release Syndrome (CRS)', 'Neurotoxicity (ICANS)', 'Hepatotoxicity', 'Infections'],
  },
  {
    id: 'd6', name: 'mRNA-4157 (V940)', target: 'Personal tumor neoantigens', disease: 'Melanoma',
    stage: 'Phase 3', status: 'Breakthrough Therapy', company: 'Moderna / Merck', type: 'mRNA Neoantigen Vaccine',
    mechanism: 'Patient-specific mRNA vaccine encoding up to 34 tumor-specific neoantigens combined with pembrolizumab.',
    efficacy: 65, safetyScore: 90,
    description: 'Personalized cancer vaccine — 65% relative reduction in recurrence or death when added to Keytruda (Phase 2b).',
    sideEffects: ['Injection site reactions', 'Fatigue', 'Chills', 'Myalgia'],
  },
  {
    id: 'd7', name: 'Prasinezumab', target: 'α-Synuclein aggregates', disease: "Parkinson's Disease",
    stage: 'Phase 2', status: 'Clinical Trial', company: 'Roche/Prothena', type: 'Anti-α-synuclein mAb',
    mechanism: 'Binds aggregated α-synuclein to reduce Lewy body pathology spread and dopaminergic neuron loss.',
    efficacy: 35, safetyScore: 88,
    description: 'Phase 2 showing signal in fast progressors. Biomarker endpoints: DaT-SPECT, CSF α-syn.',
    sideEffects: ['Infusion reactions', 'Headache', 'Arthralgia', 'Generally well-tolerated'],
  },
]

const STAGES = ['All', 'FDA Approved', 'Phase 3', 'Phase 2', 'Phase 1']
const STAGE_COLORS: Record<string, string> = {
  'FDA Approved': '#10b981', 'Phase 3': '#22d3ee', 'Phase 2': '#a855f7', 'Phase 1': '#f59e0b', 'Preclinical': '#64748b'
}

export default function DrugCandidate() {
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('All')
  const [selected, setSelected] = useState<Drug | null>(null)

  const filtered = DRUGS.filter(d =>
    (stage === 'All' || d.stage === stage) &&
    (search === '' || d.name.toLowerCase().includes(search.toLowerCase()) || d.disease.toLowerCase().includes(search.toLowerCase()) || d.target.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
          <span style={{ background: 'linear-gradient(135deg, #10b981, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Drug Candidate Explorer</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Explore drug-target interactions, mechanisms, clinical trial status, and breakthrough therapies.</p>
      </div>

      {/* Stats bar */}
      <div className="grid-4" style={{ marginBottom: '1.5rem', gap: '0.75rem' }}>
        {[['Approved Drugs','4','#10b981'],['Phase 3+','2','#22d3ee'],['Drug Targets','15+','#a855f7'],['Indications','7','#f59e0b']].map(([label,val,col]) => (
          <div key={label} className="glow-card" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: col }}>{val}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem' }}>
        <div>
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" placeholder="Search drug, target, disease..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34 }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
            {STAGES.map(s => (
              <button key={s} onClick={() => setStage(s)} style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', borderRadius: 999, border: `1px solid ${stage === s ? STAGE_COLORS[s] ?? 'var(--accent)' : 'var(--border)'}`, background: stage === s ? `${STAGE_COLORS[s] ?? 'var(--accent)'}18` : 'transparent', color: stage === s ? STAGE_COLORS[s] ?? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>{s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filtered.map(d => (
              <div key={d.id} className="glow-card" style={{ padding: '0.85rem', cursor: 'pointer', borderColor: selected?.id === d.id ? 'var(--accent)' : undefined }} onClick={() => setSelected(d)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: `${STAGE_COLORS[d.stage] ?? '#888'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TestTube2 size={18} style={{ color: STAGE_COLORS[d.stage] ?? '#888' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{d.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{d.disease} · {d.type}</div>
                    <div style={{ marginTop: '0.3rem' }}>
                      <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, background: `${STAGE_COLORS[d.stage]}20`, color: STAGE_COLORS[d.stage], fontWeight: 700 }}>{d.stage}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: d.efficacy > 70 ? '#10b981' : d.efficacy > 40 ? '#f59e0b' : '#ef4444' }}>{d.efficacy}%</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>efficacy</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selected ? (
          <div className="surface-elevated" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: '1rem', background: `${STAGE_COLORS[selected.stage] ?? '#888'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pill size={28} style={{ color: STAGE_COLORS[selected.stage] ?? '#888' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selected.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{selected.company} · {selected.type}</p>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, background: `${STAGE_COLORS[selected.stage]}20`, color: STAGE_COLORS[selected.stage], fontWeight: 700 }}>{selected.status}</span>
                  {selected.approvalYear && <span className="badge badge-green">✓ Approved {selected.approvalYear}</span>}
                </div>
              </div>
            </div>

            {/* Scores */}
            <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
              {[['Efficacy', selected.efficacy, '#10b981'], ['Safety Score', selected.safetyScore, '#22d3ee']].map(([label, val, col]) => (
                <div key={label as string} style={{ padding: '0.85rem', borderRadius: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{label as string}</div>
                  <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden', marginBottom: '0.3rem' }}>
                    <div style={{ height: '100%', width: `${val as number}%`, background: col as string, borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: col as string }}>{val as number}%</div>
                </div>
              ))}
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.875rem' }}>{selected.description}</p>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Target size={14} style={{ color: 'var(--accent)' }} /> Drug Target
              </h4>
              <code style={{ background: 'var(--bg-tertiary)', padding: '0.4rem 0.75rem', borderRadius: '0.4rem', display: 'block', fontSize: '0.85rem', color: 'var(--accent)' }}>{selected.target}</code>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={14} style={{ color: '#a855f7' }} /> Mechanism of Action
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.65 }}>{selected.mechanism}</p>
            </div>

            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>⚠️ Side Effects</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {selected.sideEffects.map(se => (
                  <span key={se} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: 999, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>{se}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="surface" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '3rem', textAlign: 'center' }}>
            <TestTube2 size={48} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <p style={{ color: 'var(--text-muted)' }}>Select a drug candidate to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
