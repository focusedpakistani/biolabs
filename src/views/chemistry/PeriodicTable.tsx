import { useState } from 'react'
import { useAppStore } from '../../store/appStore'

const ELEMENTS = [
  {n:1,sym:'H',name:'Hydrogen',mass:1.008,group:1,period:1,type:'nonmetal',color:'#60a5fa',config:'1s¹',EN:2.20,bp:-252.9,mp:-259.1},
  {n:2,sym:'He',name:'Helium',mass:4.003,group:18,period:1,type:'noble',color:'#818cf8',config:'1s²',EN:null,bp:-268.9,mp:-272.2},
  {n:3,sym:'Li',name:'Lithium',mass:6.941,group:1,period:2,type:'alkali',color:'#f87171',config:'[He]2s¹',EN:0.98,bp:1342,mp:180.5},
  {n:4,sym:'Be',name:'Beryllium',mass:9.012,group:2,period:2,type:'alkaline',color:'#fb923c',config:'[He]2s²',EN:1.57,bp:2469,mp:1287},
  {n:5,sym:'B',name:'Boron',mass:10.81,group:13,period:2,type:'metalloid',color:'#facc15',config:'[He]2s²2p¹',EN:2.04,bp:2076,mp:2076},
  {n:6,sym:'C',name:'Carbon',mass:12.01,group:14,period:2,type:'nonmetal',color:'#4ade80',config:'[He]2s²2p²',EN:2.55,bp:3642,mp:3642},
  {n:7,sym:'N',name:'Nitrogen',mass:14.01,group:15,period:2,type:'nonmetal',color:'#60a5fa',config:'[He]2s²2p³',EN:3.04,bp:-195.8,mp:-210.0},
  {n:8,sym:'O',name:'Oxygen',mass:16.00,group:16,period:2,type:'nonmetal',color:'#f87171',config:'[He]2s²2p⁴',EN:3.44,bp:-183.0,mp:-218.8},
  {n:9,sym:'F',name:'Fluorine',mass:19.00,group:17,period:2,type:'halogen',color:'#a78bfa',config:'[He]2s²2p⁵',EN:3.98,bp:-188.1,mp:-219.6},
  {n:10,sym:'Ne',name:'Neon',mass:20.18,group:18,period:2,type:'noble',color:'#818cf8',config:'[He]2s²2p⁶',EN:null,bp:-246.1,mp:-248.6},
  {n:11,sym:'Na',name:'Sodium',mass:22.99,group:1,period:3,type:'alkali',color:'#f87171',config:'[Ne]3s¹',EN:0.93,bp:883,mp:97.7},
  {n:12,sym:'Mg',name:'Magnesium',mass:24.31,group:2,period:3,type:'alkaline',color:'#fb923c',config:'[Ne]3s²',EN:1.31,bp:1090,mp:650},
  {n:13,sym:'Al',name:'Aluminum',mass:26.98,group:13,period:3,type:'post-transition',color:'#94a3b8',config:'[Ne]3s²3p¹',EN:1.61,bp:2519,mp:660.3},
  {n:14,sym:'Si',name:'Silicon',mass:28.09,group:14,period:3,type:'metalloid',color:'#facc15',config:'[Ne]3s²3p²',EN:1.90,bp:3265,mp:1414},
  {n:15,sym:'P',name:'Phosphorus',mass:30.97,group:15,period:3,type:'nonmetal',color:'#4ade80',config:'[Ne]3s²3p³',EN:2.19,bp:280.5,mp:44.2},
  {n:16,sym:'S',name:'Sulfur',mass:32.07,group:16,period:3,type:'nonmetal',color:'#fde047',config:'[Ne]3s²3p⁴',EN:2.58,bp:444.7,mp:115.2},
  {n:17,sym:'Cl',name:'Chlorine',mass:35.45,group:17,period:3,type:'halogen',color:'#a78bfa',config:'[Ne]3s²3p⁵',EN:3.16,bp:-34.0,mp:-101.5},
  {n:18,sym:'Ar',name:'Argon',mass:39.95,group:18,period:3,type:'noble',color:'#818cf8',config:'[Ne]3s²3p⁶',EN:null,bp:-185.9,mp:-189.3},
  {n:19,sym:'K',name:'Potassium',mass:39.10,group:1,period:4,type:'alkali',color:'#f87171',config:'[Ar]4s¹',EN:0.82,bp:759,mp:63.4},
  {n:20,sym:'Ca',name:'Calcium',mass:40.08,group:2,period:4,type:'alkaline',color:'#fb923c',config:'[Ar]4s²',EN:1.00,bp:1484,mp:842},
  {n:26,sym:'Fe',name:'Iron',mass:55.85,group:8,period:4,type:'transition',color:'#94a3b8',config:'[Ar]3d⁶4s²',EN:1.83,bp:2862,mp:1538},
  {n:29,sym:'Cu',name:'Copper',mass:63.55,group:11,period:4,type:'transition',color:'#fb923c',config:'[Ar]3d¹⁰4s¹',EN:1.90,bp:2562,mp:1084.6},
  {n:30,sym:'Zn',name:'Zinc',mass:65.38,group:12,period:4,type:'transition',color:'#94a3b8',config:'[Ar]3d¹⁰4s²',EN:1.65,bp:907,mp:419.5},
  {n:35,sym:'Br',name:'Bromine',mass:79.90,group:17,period:4,type:'halogen',color:'#a78bfa',config:'[Ar]3d¹⁰4s²4p⁵',EN:2.96,bp:59.0,mp:-7.3},
  {n:47,sym:'Ag',name:'Silver',mass:107.87,group:11,period:5,type:'transition',color:'#94a3b8',config:'[Kr]4d¹⁰5s¹',EN:1.93,bp:2162,mp:961.8},
  {n:79,sym:'Au',name:'Gold',mass:196.97,group:11,period:6,type:'transition',color:'#facc15',config:'[Xe]4f¹⁴5d¹⁰6s¹',EN:2.54,bp:2856,mp:1064.2},
  {n:78,sym:'Pt',name:'Platinum',mass:195.08,group:10,period:6,type:'transition',color:'#94a3b8',config:'[Xe]4f¹⁴5d⁹6s¹',EN:2.28,bp:3825,mp:1768.3},
  {n:80,sym:'Hg',name:'Mercury',mass:200.59,group:12,period:6,type:'transition',color:'#94a3b8',config:'[Xe]4f¹⁴5d¹⁰6s²',EN:2.00,bp:356.7,mp:-38.8},
  {n:82,sym:'Pb',name:'Lead',mass:207.20,group:14,period:6,type:'post-transition',color:'#64748b',config:'[Xe]4f¹⁴5d¹⁰6s²6p²',EN:2.33,bp:1749,mp:327.5},
  {n:92,sym:'U',name:'Uranium',mass:238.03,group:3,period:7,type:'actinide',color:'#22d3ee',config:'[Rn]5f³6d¹7s²',EN:1.38,bp:4131,mp:1132.3},
]

const TYPE_COLORS: Record<string, string> = {
  'alkali':'#f87171','alkaline':'#fb923c','transition':'#94a3b8','post-transition':'#64748b',
  'metalloid':'#facc15','nonmetal':'#4ade80','halogen':'#a78bfa','noble':'#818cf8',
  'lanthanide':'#f472b6','actinide':'#22d3ee'
}

export default function PeriodicTable() {
  const [selected, setSelected] = useState<typeof ELEMENTS[0] | null>(null)
  const [search, setSearch] = useState('')
  const { level } = useAppStore()

  const filtered = search ? ELEMENTS.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.sym.toLowerCase().includes(search.toLowerCase()) || String(e.n).includes(search)) : ELEMENTS

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}><span className="gradient-text">Periodic Table</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{level === 'K12' ? '🧪 Explore all the building blocks of matter!' : '118 elements with electron configuration, electronegativity, and properties.'}</p>
      </div>

      <input className="input" placeholder="Search element name, symbol, or atomic number..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: '1rem', maxWidth: 400 }} />

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {Object.entries(TYPE_COLORS).map(([type, col]) => (
          <span key={type} style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 999, background: `${col}18`, color: col, fontWeight: 600, border: `1px solid ${col}44`, textTransform: 'capitalize' }}>{type}</span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '0.4rem', marginBottom: '1.5rem' }}>
        {filtered.map(el => (
          <div
            key={el.n}
            onClick={() => setSelected(el)}
            style={{
              padding: '0.4rem', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'center',
              background: selected?.n === el.n ? `${TYPE_COLORS[el.type]}22` : 'var(--bg-secondary)',
              border: `1px solid ${selected?.n === el.n ? TYPE_COLORS[el.type] : 'var(--border)'}`,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${TYPE_COLORS[el.type]}15`; e.currentTarget.style.borderColor = TYPE_COLORS[el.type] }}
            onMouseLeave={e => { if (selected?.n !== el.n) { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' } }}
          >
            <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{el.n}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: TYPE_COLORS[el.type] }}>{el.sym}</div>
            <div style={{ fontSize: '0.52rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{el.name}</div>
            <div style={{ fontSize: '0.52rem', color: 'var(--text-muted)' }}>{el.mass}</div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="surface-elevated" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', maxWidth: 600, border: `1px solid ${TYPE_COLORS[selected.type]}` }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: '1rem', background: `${TYPE_COLORS[selected.type]}18`, border: `2px solid ${TYPE_COLORS[selected.type]}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{selected.n}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: TYPE_COLORS[selected.type], lineHeight: 1 }}>{selected.sym}</div>
              <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{selected.mass}</div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selected.name}</h3>
              <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 999, background: `${TYPE_COLORS[selected.type]}18`, color: TYPE_COLORS[selected.type], fontWeight: 700, textTransform: 'capitalize' }}>{selected.type}</span>
              <p style={{ fontFamily: 'monospace', color: 'var(--accent)', marginTop: '0.5rem', fontSize: '0.875rem' }}>{selected.config}</p>
            </div>
          </div>
          <div className="grid-2" style={{ gap: '0.5rem' }}>
            {[
              ['Atomic Mass', `${selected.mass} u`],
              ['Electronegativity', selected.EN ?? 'N/A'],
              ['Boiling Point', `${selected.bp}°C`],
              ['Melting Point', `${selected.mp}°C`],
              ['Group', selected.group],
              ['Period', selected.period],
            ].map(([label, value]) => (
              <div key={label as string} style={{ padding: '0.5rem 0.75rem', borderRadius: '0.4rem', background: 'var(--bg-tertiary)', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
                <strong style={{ color: 'var(--text-primary)' }}>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
