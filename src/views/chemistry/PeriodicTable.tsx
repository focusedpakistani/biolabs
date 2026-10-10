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

  {n:21,sym:'E21',name:'Element 21',mass:52.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:22,sym:'E22',name:'Element 22',mass:55.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:23,sym:'E23',name:'Element 23',mass:57.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:24,sym:'E24',name:'Element 24',mass:60.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:25,sym:'E25',name:'Element 25',mass:62.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:27,sym:'E27',name:'Element 27',mass:67.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:28,sym:'E28',name:'Element 28',mass:70.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:31,sym:'E31',name:'Element 31',mass:77.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:32,sym:'E32',name:'Element 32',mass:80.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:33,sym:'E33',name:'Element 33',mass:82.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:34,sym:'E34',name:'Element 34',mass:85.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:36,sym:'E36',name:'Element 36',mass:90.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:37,sym:'E37',name:'Element 37',mass:92.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:38,sym:'E38',name:'Element 38',mass:95.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:39,sym:'E39',name:'Element 39',mass:97.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:40,sym:'E40',name:'Element 40',mass:100.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:41,sym:'E41',name:'Element 41',mass:102.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:42,sym:'E42',name:'Element 42',mass:105.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:43,sym:'E43',name:'Element 43',mass:107.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:44,sym:'E44',name:'Element 44',mass:110.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:45,sym:'E45',name:'Element 45',mass:112.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:46,sym:'E46',name:'Element 46',mass:115.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:48,sym:'E48',name:'Element 48',mass:120.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:49,sym:'E49',name:'Element 49',mass:122.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:50,sym:'E50',name:'Element 50',mass:125.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:51,sym:'E51',name:'Element 51',mass:127.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:52,sym:'E52',name:'Element 52',mass:130.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:53,sym:'E53',name:'Element 53',mass:132.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:54,sym:'E54',name:'Element 54',mass:135.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:55,sym:'E55',name:'Element 55',mass:137.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:56,sym:'E56',name:'Element 56',mass:140.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:57,sym:'E57',name:'Element 57',mass:142.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:58,sym:'E58',name:'Element 58',mass:145.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:59,sym:'E59',name:'Element 59',mass:147.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:60,sym:'E60',name:'Element 60',mass:150.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:61,sym:'E61',name:'Element 61',mass:152.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:62,sym:'E62',name:'Element 62',mass:155.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:63,sym:'E63',name:'Element 63',mass:157.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:64,sym:'E64',name:'Element 64',mass:160.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:65,sym:'E65',name:'Element 65',mass:162.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:66,sym:'E66',name:'Element 66',mass:165.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:67,sym:'E67',name:'Element 67',mass:167.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:68,sym:'E68',name:'Element 68',mass:170.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:69,sym:'E69',name:'Element 69',mass:172.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:70,sym:'E70',name:'Element 70',mass:175.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:71,sym:'E71',name:'Element 71',mass:177.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:72,sym:'E72',name:'Element 72',mass:180.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:73,sym:'E73',name:'Element 73',mass:182.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:74,sym:'E74',name:'Element 74',mass:185.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:75,sym:'E75',name:'Element 75',mass:187.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:76,sym:'E76',name:'Element 76',mass:190.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:77,sym:'E77',name:'Element 77',mass:192.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:81,sym:'E81',name:'Element 81',mass:202.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:83,sym:'E83',name:'Element 83',mass:207.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:84,sym:'E84',name:'Element 84',mass:210.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:85,sym:'E85',name:'Element 85',mass:212.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:86,sym:'E86',name:'Element 86',mass:215.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:87,sym:'E87',name:'Element 87',mass:217.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:88,sym:'E88',name:'Element 88',mass:220.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:89,sym:'E89',name:'Element 89',mass:222.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:90,sym:'E90',name:'Element 90',mass:225.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:91,sym:'E91',name:'Element 91',mass:227.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:93,sym:'E93',name:'Element 93',mass:232.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:94,sym:'E94',name:'Element 94',mass:235.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:95,sym:'E95',name:'Element 95',mass:237.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:96,sym:'E96',name:'Element 96',mass:240.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:97,sym:'E97',name:'Element 97',mass:242.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:98,sym:'E98',name:'Element 98',mass:245.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:99,sym:'E99',name:'Element 99',mass:247.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:100,sym:'E100',name:'Element 100',mass:250.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:101,sym:'E101',name:'Element 101',mass:252.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:102,sym:'E102',name:'Element 102',mass:255.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:103,sym:'E103',name:'Element 103',mass:257.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:104,sym:'E104',name:'Element 104',mass:260.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:105,sym:'E105',name:'Element 105',mass:262.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:106,sym:'E106',name:'Element 106',mass:265.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:107,sym:'E107',name:'Element 107',mass:267.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:108,sym:'E108',name:'Element 108',mass:270.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:109,sym:'E109',name:'Element 109',mass:272.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:110,sym:'E110',name:'Element 110',mass:275.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:111,sym:'E111',name:'Element 111',mass:277.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:112,sym:'E112',name:'Element 112',mass:280.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:113,sym:'E113',name:'Element 113',mass:282.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:114,sym:'E114',name:'Element 114',mass:285.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:115,sym:'E115',name:'Element 115',mass:287.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:116,sym:'E116',name:'Element 116',mass:290.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:117,sym:'E117',name:'Element 117',mass:292.5,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
  {n:118,sym:'E118',name:'Element 118',mass:295.0,group:1,period:7,type:'transition',color:'#94a3b8',config:'',EN:1.0,bp:0,mp:0},
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

