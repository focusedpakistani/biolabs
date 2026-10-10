import { useState } from 'react'
import { Search, Bug, TrendingUp, ChevronRight, Zap, AlertTriangle } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

interface Disease {
  id: string; name: string; category: string; icd10: string; prevalence: string
  description: string; symptoms: string[]; causes: string[]; mechanisms: string[]
  treatments: string[]; drugTargets: string[]; recentResearch: string; severity: 'low' | 'moderate' | 'high' | 'critical'
  affectsSystem: string[]; mortality: string; onset: string
}

const DISEASES: Disease[] = [
  {
    id: 'alzheimer', name: "Alzheimer's Disease", category: 'Neurological', icd10: 'G30', prevalence: '~50M worldwide',
    description: "Progressive neurodegenerative disorder causing memory loss, cognitive decline, and behavioral changes.",
    symptoms: ['Memory loss', 'Confusion', 'Disorientation', 'Language problems', 'Behavioral changes', 'Difficulty with daily tasks'],
    causes: ['Amyloid-β plaques', 'Tau tangles', 'Neuroinflammation', 'APOE4 gene variant', 'Age', 'Family history'],
    mechanisms: ['Amyloid cascade hypothesis', 'Tau hyperphosphorylation', 'Cholinergic neuron loss', 'Oxidative stress', 'Synaptic dysfunction'],
    treatments: ['Donepezil (AChE inhibitor)', 'Memantine (NMDA antagonist)', 'Lecanemab (anti-amyloid mAb)', 'Cognitive therapy', 'Caregiver support'],
    drugTargets: ['Acetylcholinesterase', 'NMDA receptor', 'Amyloid-β peptide', 'BACE1', 'Tau kinases'],
    recentResearch: "Lecanemab (Leqembi) approved 2023 — first amyloid-clearing antibody showing slowed decline. ARIA monitoring critical. CAR-T cell approaches in trials.",
    severity: 'critical', affectsSystem: ['Brain', 'Nervous System'], mortality: '~3M deaths/year (6th leading cause)', onset: 'Typically >65 years'
  },
  {
    id: 'cancer_lung', name: 'Lung Cancer (NSCLC)', category: 'Oncology', icd10: 'C34', prevalence: '~2.2M new cases/yr',
    description: "Non-small cell lung cancer — most common type, arising from bronchial epithelium. Includes adenocarcinoma, squamous cell, large cell.",
    symptoms: ['Persistent cough', 'Blood in sputum', 'Chest pain', 'Shortness of breath', 'Weight loss', 'Hoarseness'],
    causes: ['Smoking (90%)', 'Radon gas', 'Asbestos', 'KRAS/EGFR mutations', 'Air pollution', 'Genetic predisposition'],
    mechanisms: ['TP53 mutation', 'KRAS oncogene activation', 'EGFR overexpression', 'ALK fusion', 'PD-L1 immune evasion'],
    treatments: ['Osimertinib (EGFR inhibitor)', 'Pembrolizumab (PD-1 blockade)', 'Chemotherapy', 'Surgery', 'Radiation', 'ALK inhibitors'],
    drugTargets: ['EGFR', 'KRAS G12C', 'ALK', 'PD-1/PD-L1', 'VEGFR', 'MET', 'BRAF V600E'],
    recentResearch: "Sotorasib (AMG 510) — first KRAS G12C inhibitor (FDA 2021). Bispecific antibodies. mRNA cancer vaccines in Phase II/III. CAR-T for solid tumors.",
    severity: 'critical', affectsSystem: ['Lungs', 'Lymph nodes', 'Metastasis'], mortality: '1.8M deaths/year', onset: 'Mostly >50 years'
  },
  {
    id: 'diabetes_t2', name: 'Type 2 Diabetes', category: 'Metabolic', icd10: 'E11', prevalence: '~537M worldwide',
    description: "Chronic metabolic disorder characterized by insulin resistance and relative insulin deficiency.",
    symptoms: ['Polyuria', 'Polydipsia', 'Fatigue', 'Blurred vision', 'Slow healing wounds', 'Peripheral neuropathy'],
    causes: ['Insulin resistance', 'Obesity', 'Sedentary lifestyle', 'Genetic factors', 'Beta-cell dysfunction', 'High-calorie diet'],
    mechanisms: ['GLUT4 downregulation', 'Pancreatic β-cell exhaustion', 'Glucotoxicity', 'Lipotoxicity', 'Chronic inflammation (IL-6, TNF-α)'],
    treatments: ['Metformin (first-line)', 'GLP-1 agonists (semaglutide)', 'SGLT2 inhibitors', 'Insulin therapy', 'Lifestyle modification'],
    drugTargets: ['GLP-1 receptor', 'SGLT2', 'DPP-4', 'PPAR-γ', 'Glucokinase', 'GIPR'],
    recentResearch: "Tirzepatide (GIP+GLP-1 dual agonist) — 20% weight reduction. Islet transplantation advances. Closed-loop insulin systems.",
    severity: 'moderate', affectsSystem: ['Pancreas', 'Liver', 'Kidneys', 'Vasculature'], mortality: '1.5M direct deaths/yr', onset: 'Middle-age onwards'
  },
  {
    id: 'covid19', name: 'COVID-19 (SARS-CoV-2)', category: 'Infectious', icd10: 'U07.1', prevalence: '700M+ confirmed cases',
    description: "Respiratory illness caused by SARS-CoV-2 coronavirus — ranges from mild to severe ARDS, with long COVID sequelae.",
    symptoms: ['Fever', 'Dry cough', 'Fatigue', 'Loss of smell/taste', 'Shortness of breath', 'Cytokine storm (severe)'],
    causes: ['SARS-CoV-2 spike protein binding ACE2', 'Droplet & aerosol transmission', 'Immunocompromise', 'Viral load'],
    mechanisms: ['ACE2 receptor entry', 'TMPRSS2 priming', 'Cytokine storm (IL-6, TNF)', 'T-cell lymphopenia', 'Endothelial damage', 'Thrombus formation'],
    treatments: ['Nirmatrelvir/ritonavir (Paxlovid)', 'mRNA vaccines (Pfizer, Moderna)', 'Remdesivir', 'Dexamethasone (severe)', 'mAbs'],
    drugTargets: ['Main protease (Mpro/3CLpro)', 'RdRp (nsp12)', 'Spike-ACE2 interface', 'TMPRSS2', 'IL-6 receptor'],
    recentResearch: "XBB.1.5 adapted vaccines (2024). Mucosal vaccine research. Long COVID: ME/CFS mechanisms, small fiber neuropathy. Persistent spike antigen found.",
    severity: 'high', affectsSystem: ['Lungs', 'Heart', 'Brain', 'Kidneys'], mortality: '7M+ confirmed deaths', onset: 'Any age; severe in elderly'
  },
  {
    id: 'hiv', name: 'HIV/AIDS', category: 'Infectious', icd10: 'B20-B24', prevalence: '39M living with HIV',
    description: "HIV progressively destroys CD4+ T-cells, leading to AIDS — opportunistic infections and cancers.",
    symptoms: ['Acute: flu-like (2-4 wk)', 'Latent: asymptomatic', 'AIDS: weight loss, OIs, Kaposi\'s sarcoma', 'Night sweats, lymphadenopathy'],
    causes: ['HIV-1/HIV-2 retrovirus', 'Sexual contact', 'Blood-to-blood', 'Mother-to-child', 'Needle sharing'],
    mechanisms: ['gp120 binds CD4 + CCR5/CXCR4', 'Reverse transcription', 'Proviral integration', 'CD4+ T-cell depletion', 'Immune dysregulation'],
    treatments: ['cART (3+ antiretrovirals)', 'Biktarvy', 'Descovy PrEP', 'Lenacapavir (long-acting)', 'CCR5 antagonists'],
    drugTargets: ['Reverse transcriptase', 'Integrase', 'Protease', 'CCR5', 'Capsid (lenacapavir)', 'gp41 fusion'],
    recentResearch: "Lenacapavir — twice-yearly injection for treatment/prevention. HIV cure research: broadly neutralizing antibodies, shock-and-kill latency reversal, gene editing of provirus.",
    severity: 'critical', affectsSystem: ['Immune System', 'Lymph nodes', 'Brain'], mortality: '630K deaths/yr (2022)', onset: 'Any age after exposure'
  },
  {
    id: 'parkinson', name: "Parkinson's Disease", category: 'Neurological', icd10: 'G20', prevalence: '10M worldwide',
    description: "Neurodegenerative disorder with progressive loss of dopaminergic neurons in substantia nigra.",
    symptoms: ['Resting tremor', 'Bradykinesia', 'Rigidity', 'Postural instability', 'Depression', 'Autonomic dysfunction'],
    causes: ['Alpha-synuclein aggregation (Lewy bodies)', 'LRRK2/PINK1 mutations', 'Mitochondrial dysfunction', 'Neuroinflammation', 'Pesticide exposure'],
    mechanisms: ['Dopamine depletion in striatum', 'α-synuclein fibril propagation', 'Ubiquitin-proteasome impairment', 'Microglial activation'],
    treatments: ['Levodopa/Carbidopa', 'Dopamine agonists (pramipexole)', 'MAO-B inhibitors', 'DBS (deep brain stimulation)', 'COMT inhibitors'],
    drugTargets: ['LRRK2 kinase', 'α-synuclein', 'GBA1', 'Dopamine transporters', 'GLP-1R'],
    recentResearch: "LRRK2 inhibitors in Phase II. Prasinezumab (anti-α-synuclein mAb). GLP-1 agonists (exenatide) showing neuroprotection. Brain organoid models.",
    severity: 'high', affectsSystem: ['Substantia Nigra', 'Basal Ganglia', 'Autonomic NS'], mortality: '3rd most common neurodegenerative', onset: 'Typically >60 years'
  },
]

const CATEGORIES = ['All', 'Neurological', 'Oncology', 'Metabolic', 'Infectious']
const SEVERITY_COLORS = { low: '#10b981', moderate: '#f59e0b', high: '#f97316', critical: '#ef4444' }

export default function DiseaseDB() {
  const { level } = useAppStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<Disease | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'mechanisms' | 'treatments' | 'research'>('overview')

  const filtered = DISEASES.filter(d =>
    (category === 'All' || d.category === category) &&
    (search === '' || d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
     d.causes.some(c => c.toLowerCase().includes(search.toLowerCase())))
  )

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
          <span style={{ background: 'linear-gradient(135deg, #ef4444, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Disease Discovery Database</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {level === 'K12' ? '🏥 Learn about diseases — what causes them and how doctors help people get better!'
           : 'Explore pathophysiology, molecular mechanisms, drug targets & cutting-edge research for major diseases.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', minHeight: 600 }}>
        {/* Left: Search + list */}
        <div>
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" placeholder="Search diseases, symptoms, genes..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, fontSize: '0.85rem' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`btn ${category === c ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>{c}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 520, overflowY: 'auto' }}>
            {filtered.map(d => (
              <div key={d.id} onClick={() => { setSelected(d); setActiveTab('overview') }} className="glow-card" style={{ padding: '0.85rem', cursor: 'pointer', borderColor: selected?.id === d.id ? 'var(--accent)' : 'var(--border)', background: selected?.id === d.id ? 'var(--accent-glow)' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: SEVERITY_COLORS[d.severity], marginTop: 4, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{d.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {d.category} · {d.prevalence}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, background: `${SEVERITY_COLORS[d.severity]}18`, color: SEVERITY_COLORS[d.severity], fontWeight: 700, flexShrink: 0, textTransform: 'capitalize' }}>{d.severity}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', fontSize: '0.875rem' }}>No diseases found for "{search}"</p>}
          </div>
        </div>

        {/* Right: Details */}
        {selected ? (
          <div className="surface-elevated" style={{ padding: '1.5rem', overflowY: 'auto' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selected.name}</h3>
                <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: 6, background: `${SEVERITY_COLORS[selected.severity]}18`, color: SEVERITY_COLORS[selected.severity], fontWeight: 700 }}>
                  {selected.severity.toUpperCase()} SEVERITY
                </span>
                <span className="badge badge-cyan">{selected.icd10}</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>🌍 {selected.prevalence}</span>
                <span>💀 {selected.mortality}</span>
                <span>⏱️ {selected.onset}</span>
                <span>🫀 {selected.affectsSystem.join(', ')}</span>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              {(['overview','mechanisms','treatments','research'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem 0.5rem 0 0', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', background: activeTab === tab ? 'var(--accent)' : 'transparent', color: activeTab === tab ? '#060d1a' : 'var(--text-muted)', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '0.9rem' }}>{selected.description}</p>
                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.6rem', color: 'var(--accent)' }}>🤒 Symptoms</h4>
                    {selected.symptoms.map(s => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.82rem' }}>
                        <ChevronRight size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} /> {s}
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.6rem', color: '#ef4444' }}>⚠️ Causes & Risk Factors</h4>
                    {selected.causes.map(c => (
                      <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.82rem' }}>
                        <AlertTriangle size={11} style={{ color: '#ef4444', flexShrink: 0 }} /> {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mechanisms' && (
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', color: '#a855f7' }}>🔬 Molecular Mechanisms</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {selected.mechanisms.map((m, i) => (
                    <div key={m} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700, color: '#a855f7' }}>{i+1}</div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, alignSelf: 'center' }}>{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'treatments' && (
              <div>
                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', color: '#10b981' }}>💊 Current Treatments</h4>
                    {selected.treatments.map(t => (
                      <div key={t} style={{ padding: '0.5rem 0.75rem', borderRadius: '0.4rem', marginBottom: '0.35rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.82rem' }}>{t}</div>
                    ))}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', color: '#22d3ee' }}>🎯 Drug Targets</h4>
                    {selected.drugTargets.map(dt => (
                      <div key={dt} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', borderRadius: '0.4rem', marginBottom: '0.35rem', background: 'var(--accent-glow)', border: '1px solid rgba(34,211,238,0.2)', fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 600 }}>
                        <Zap size={11} style={{ color: 'var(--accent)' }} /> {dt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'research' && (
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', color: '#f59e0b' }}>
                  <TrendingUp size={15} style={{ display: 'inline', marginRight: 4 }} />
                  Latest Research & Breakthroughs
                </h4>
                <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', lineHeight: 1.8 }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{selected.recentResearch}</p>
                </div>
                <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-tertiary)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  💡 <strong>Tip:</strong> Use the <strong>Drug Candidates</strong> module to explore specific drug-target interactions for {selected.name}.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="surface" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '3rem', textAlign: 'center' }}>
            <Bug size={48} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <p style={{ color: 'var(--text-muted)' }}>Select a disease to view detailed information</p>
          </div>
        )}
      </div>
    </div>
  )
}
