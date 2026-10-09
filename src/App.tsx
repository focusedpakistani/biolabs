import { useEffect, lazy, Suspense, type ReactElement } from 'react'
import { useAppStore } from './store/appStore'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import AIAssistant from './components/ai/AIAssistant'
import SearchModal from './components/layout/SearchModal'
import Notifications from './components/layout/Notifications'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy-load views
const Dashboard      = lazy(() => import('./views/Dashboard'))
const Protein3D      = lazy(() => import('./views/biology/Protein3D'))
const DNA3D          = lazy(() => import('./views/biology/DNA3D'))
const CellSandbox    = lazy(() => import('./views/biology/CellSandbox'))
const CrisprEditor   = lazy(() => import('./views/biology/CrisprEditor'))
const MetabolicPaths = lazy(() => import('./views/biology/MetabolicPaths'))
const Immunology     = lazy(() => import('./views/biology/Immunology'))
const Neuroscience   = lazy(() => import('./views/biology/Neuroscience'))

const PeriodicTable  = lazy(() => import('./views/chemistry/PeriodicTable'))
const MolViewer3D    = lazy(() => import('./views/chemistry/MolViewer3D'))
const Reactions      = lazy(() => import('./views/chemistry/Reactions'))
const QuantumChem    = lazy(() => import('./views/chemistry/QuantumChem'))

const Mechanics      = lazy(() => import('./views/physics/Mechanics'))
const WaveOptics     = lazy(() => import('./views/physics/WaveOptics'))
const Nuclear        = lazy(() => import('./views/physics/Nuclear'))

const Anatomy        = lazy(() => import('./views/medical/Anatomy'))
const Pharmacology   = lazy(() => import('./views/medical/Pharmacology'))
const ClinicalCases  = lazy(() => import('./views/medical/ClinicalCases'))
const Diagnosis      = lazy(() => import('./views/medical/Diagnosis'))

const DiseaseDB      = lazy(() => import('./views/discovery/DiseaseDB'))
const DrugCandidate  = lazy(() => import('./views/discovery/DrugCandidate'))
const ResearchHub    = lazy(() => import('./views/discovery/ResearchHub'))
const Genomics       = lazy(() => import('./views/discovery/Genomics'))

const KnowledgeBase  = lazy(() => import('./views/learning/KnowledgeBase'))
const QuizMode       = lazy(() => import('./views/learning/QuizMode'))
const Flashcards     = lazy(() => import('./views/learning/Flashcards'))
const Timeline       = lazy(() => import('./views/learning/Timeline'))
const ToolsHub       = lazy(() => import('./views/tools/ToolsHub'))
const Settings       = lazy(() => import('./views/settings/Settings'))

function ViewRenderer() {
  const { currentModule } = useAppStore()
  const views: Record<string, ReactElement> = {
    dashboard:    <Dashboard />,
    protein3d:    <Protein3D />,
    dna3d:        <DNA3D />,
    cell:         <CellSandbox />,
    crispr:       <CrisprEditor />,
    metabolic:    <MetabolicPaths />,
    immunology:   <Immunology />,
    neuroscience: <Neuroscience />,
    periodic:     <PeriodicTable />,
    molecules3d:  <MolViewer3D />,
    reactions:    <Reactions />,
    quantum:      <QuantumChem />,
    mechanics:    <Mechanics />,
    waves:        <WaveOptics />,
    nuclear:      <Nuclear />,
    anatomy:      <Anatomy />,
    pharmacology: <Pharmacology />,
    clinical:     <ClinicalCases />,
    diagnosis:    <Diagnosis />,
    diseasedb:    <DiseaseDB />,
    drugcandidate:<DrugCandidate />,
    research:     <ResearchHub />,
    genomics:     <Genomics />,
    kb:           <KnowledgeBase />,
    quiz:         <QuizMode />,
    flashcards:   <Flashcards />,
    timeline:     <Timeline />,
    tools:        <ToolsHub />,
    settings:     <Settings />,
  }
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="fade-in">
        {views[currentModule] ?? <Dashboard />}
      </div>
    </Suspense>
  )
}

export default function App() {
  const { theme, sidebarOpen, setSidebarOpen } = useAppStore()

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto', padding: '1.5rem', minWidth: 0 }}>
          <ViewRenderer />
        </main>
      </div>
      <AIAssistant />
      <SearchModal />
      <Notifications />
    </div>
  )
}
