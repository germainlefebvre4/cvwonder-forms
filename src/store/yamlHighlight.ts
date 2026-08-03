import { create } from 'zustand'

interface YamlHighlightState {
  /** Path of the field currently under the pointer (session-only UI state, not persisted). */
  hoveredPath: string | null
  /** Path of the last-clicked field - persists until another field is clicked or deselected. */
  selectedPath: string | null
  setHovered: (path: string | null) => void
  setSelected: (path: string | null) => void
}

export const useYamlHighlightStore = create<YamlHighlightState>()((set) => ({
  hoveredPath: null,
  selectedPath: null,
  setHovered: (path) => set({ hoveredPath: path }),
  setSelected: (path) => set({ selectedPath: path }),
}))
