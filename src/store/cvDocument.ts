import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { JsonObject, JsonValue, Path } from '../schema/types'
import { appendAtPath, getAtPath, moveAtPath, removeAtPath, setAtPath, unsetAtPath } from '../schema/pathUtils'

interface CvDocumentState {
  document: JsonObject
  setValue: (path: Path, value: JsonValue) => void
  unsetValue: (path: Path) => void
  addItem: (path: Path, value: JsonValue) => void
  removeItem: (path: Path, index: number) => void
  moveItem: (path: Path, fromIndex: number, toIndex: number) => void
  replaceDocument: (document: JsonObject) => void
  reset: () => void
}

export const useCvDocumentStore = create<CvDocumentState>()(
  persist(
    (set) => ({
      document: {},
      setValue: (path, value) =>
        set((state) => ({ document: setAtPath(state.document, path, value) as JsonObject })),
      unsetValue: (path) => set((state) => ({ document: unsetAtPath(state.document, path) as JsonObject })),
      addItem: (path, value) =>
        set((state) => ({ document: appendAtPath(state.document, path, value) as JsonObject })),
      removeItem: (path, index) =>
        set((state) => ({ document: removeAtPath(state.document, path, index) as JsonObject })),
      moveItem: (path, fromIndex, toIndex) =>
        set((state) => ({ document: moveAtPath(state.document, path, fromIndex, toIndex) as JsonObject })),
      replaceDocument: (document) => set({ document }),
      reset: () => set({ document: {} }),
    }),
    {
      // Local-only autosave (app-persistence): survives a reload, never leaves the browser.
      name: 'cvwonder-forms/document',
      partialize: (state) => ({ document: state.document }),
    },
  ),
)

export function useCvFieldValue(path: Path): JsonValue | undefined {
  return useCvDocumentStore((state) => getAtPath(state.document, path))
}
