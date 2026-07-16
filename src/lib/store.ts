import { create } from 'zustand'
import { TerminalId } from '@/types'

interface TerminalStore {
  selectedTerminal: TerminalId
  setSelectedTerminal: (t: TerminalId) => void
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  selectedTerminal: 'T2',
  setSelectedTerminal: (selectedTerminal) => set({ selectedTerminal }),
}))

interface LevelStore {
  selectedLevel: number
  setSelectedLevel: (lvl: number) => void
}

export const useLevelStore = create<LevelStore>((set) => ({
  selectedLevel: 3,
  setSelectedLevel: (selectedLevel) => set({ selectedLevel }),
}))
