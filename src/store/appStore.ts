import { create } from 'zustand'

export type Theme = 'dark' | 'light'

export type Module = 
  | 'dashboard'
  // Biology
  | 'protein3d' | 'dna3d' | 'cell' | 'crispr' | 'metabolic' | 'replication'
  | 'pcr' | 'gel' | 'division' | 'punnett' | 'phylo' | 'kinetics'
  | 'bloodtype' | 'hardy' | 'cellcycle' | 'operon' | 'microscope'
  | 'immunology' | 'neuroscience'
  // Chemistry
  | 'periodic' | 'reactions' | 'molecules3d' | 'titration' | 'spectroscopy' | 'quantum'
  // Physics
  | 'mechanics' | 'waves' | 'optics' | 'electro' | 'thermo' | 'nuclear'
  // Medical
  | 'anatomy' | 'pharmacology' | 'clinical' | 'diagnosis' | 'pathology' | 'radiology'
  // Discovery Platform
  | 'diseasedb' | 'drugcandidate' | 'research' | 'genomics' | 'biomarkers'
  // Learning
  | 'kb' | 'quiz' | 'flashcards' | 'timeline' | 'ai' | 'tools'
  | 'glossary' | 'references' | 'settings'

export interface UserProgress {
  module: Module
  completed: boolean
  score?: number
  lastVisited?: Date
}

interface AppState {
  theme: Theme
  currentModule: Module
  sidebarOpen: boolean
  aiPanelOpen: boolean
  searchOpen: boolean
  level: 'K12' | 'undergrad' | 'grad' | 'phd'
  progress: Record<string, UserProgress>
  bookmarks: string[]
  notifications: { id: string; text: string; type: 'info' | 'success' | 'warning' }[]

  setTheme: (t: Theme) => void
  setModule: (m: Module) => void
  toggleSidebar: () => void
  setSidebarOpen: (v: boolean) => void
  toggleAI: () => void
  setSearchOpen: (v: boolean) => void
  setLevel: (l: AppState['level']) => void
  addProgress: (p: UserProgress) => void
  toggleBookmark: (id: string) => void
  addNotification: (n: Omit<AppState['notifications'][0], 'id'>) => void
  removeNotification: (id: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: 'dark',
  currentModule: 'dashboard',
  sidebarOpen: false,
  aiPanelOpen: false,
  searchOpen: false,
  level: 'undergrad',
  progress: {},
  bookmarks: [],
  notifications: [],

  setTheme: (t) => {
    set({ theme: t })
    document.documentElement.classList.toggle('light', t === 'light')
  },
  setModule: (m) => set({ currentModule: m, sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleAI: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setLevel: (l) => set({ level: l }),
  addProgress: (p) => set((s) => ({ progress: { ...s.progress, [p.module]: p } })),
  toggleBookmark: (id) => set((s) => ({
    bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter(b => b !== id) : [...s.bookmarks, id]
  })),
  addNotification: (n) => {
    const id = Date.now().toString()
    set((s) => ({ notifications: [...s.notifications, { ...n, id }] }))
    setTimeout(() => get().removeNotification(id), 5000)
  },
  removeNotification: (id) => set((s) => ({ notifications: s.notifications.filter(n => n.id !== id) })),
}))
