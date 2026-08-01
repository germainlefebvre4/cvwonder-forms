import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { JsonObject, JsonValue, Path } from '../schema/types'
import { appendAtPath, getAtPath, moveAtPath, removeAtPath, setAtPath, unsetAtPath } from '../schema/pathUtils'

interface CvDocumentState {
  document: JsonObject
  /** Top-level section keys the user has edited this session (UI-only, not persisted). */
  touchedSections: ReadonlySet<string>
  setValue: (path: Path, value: JsonValue) => void
  unsetValue: (path: Path) => void
  addItem: (path: Path, value: JsonValue) => void
  removeItem: (path: Path, index: number) => void
  moveItem: (path: Path, fromIndex: number, toIndex: number) => void
  replaceDocument: (document: JsonObject) => void
  reset: () => void
}

/** Marks the top-level section a mutation path falls under as touched. */
function withTouchedSection(touched: ReadonlySet<string>, path: Path): ReadonlySet<string> {
  const sectionKey = path[0]
  if (typeof sectionKey !== 'string' || touched.has(sectionKey)) return touched
  return new Set(touched).add(sectionKey)
}

export const useCvDocumentStore = create<CvDocumentState>()(
  persist(
    (set) => ({
      document: {},
      touchedSections: new Set(),
      setValue: (path, value) =>
        set((state) => ({
          document: setAtPath(state.document, path, value) as JsonObject,
          touchedSections: withTouchedSection(state.touchedSections, path),
        })),
      unsetValue: (path) =>
        set((state) => ({
          document: unsetAtPath(state.document, path) as JsonObject,
          touchedSections: withTouchedSection(state.touchedSections, path),
        })),
      addItem: (path, value) =>
        set((state) => ({
          document: appendAtPath(state.document, path, value) as JsonObject,
          touchedSections: withTouchedSection(state.touchedSections, path),
        })),
      removeItem: (path, index) =>
        set((state) => ({
          document: removeAtPath(state.document, path, index) as JsonObject,
          touchedSections: withTouchedSection(state.touchedSections, path),
        })),
      moveItem: (path, fromIndex, toIndex) =>
        set((state) => ({
          document: moveAtPath(state.document, path, fromIndex, toIndex) as JsonObject,
          touchedSections: withTouchedSection(state.touchedSections, path),
        })),
      replaceDocument: (document) => set({ document, touchedSections: new Set() }),
      reset: () => set({ document: {}, touchedSections: new Set() }),
    }),
    {
      // Local-only autosave (app-persistence): survives a reload, never leaves the browser.
      // touchedSections is deliberately excluded - it's session-only UI state.
      name: 'cvwonder-forms/document',
      partialize: (state) => ({ document: state.document }),
    },
  ),
)

export function useCvFieldValue(path: Path): JsonValue | undefined {
  return useCvDocumentStore((state) => getAtPath(state.document, path))
}
