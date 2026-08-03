import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ArrayFieldDescriptor, Path } from '../../../schema/types'
import type { ValidationIssue } from '../../../schema/validator'
import { buildDefaultValue } from '../../../schema/pathUtils'
import { fieldElementId } from '../../../schema/sectionStatus'
import { fieldLabelKey } from '../../../i18n'
import { useCvDocumentStore, useCvFieldValue } from '../../../store/cvDocument'
import { FieldNode } from '../FieldNode'
import { useFieldHighlight } from '../useFieldHighlight'
import { FieldErrorList } from './FieldErrorList'
import { addButtonClass, dragHandleClass, dragOverIndicatorClass, iconButtonClass, railClass } from './inputStyles'

interface RepeatableObjectListProps {
  descriptor: ArrayFieldDescriptor
  path: Path
  errors?: ValidationIssue[]
}

interface SortableCardProps {
  id: string
  isDropTarget: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  disableUp: boolean
  disableDown: boolean
  children: ReactNode
}

function SortableCard({ id, isDropTarget, onMoveUp, onMoveDown, disableUp, disableDown, children }: SortableCardProps) {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex gap-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700 ${
        isDropTarget ? dragOverIndicatorClass : ''
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className={railClass}>
        <button
          type="button"
          className={dragHandleClass}
          aria-label={t('actions.dragToReorder')}
          {...attributes}
          {...listeners}
        >
          ⠿
        </button>
        <button
          type="button"
          className={iconButtonClass}
          disabled={disableUp}
          onClick={onMoveUp}
          aria-label={t('actions.moveUp')}
        >
          ↑
        </button>
        <button
          type="button"
          className={iconButtonClass}
          disabled={disableDown}
          onClick={onMoveDown}
          aria-label={t('actions.moveDown')}
        >
          ↓
        </button>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export function RepeatableObjectList({ descriptor, path, errors }: RepeatableObjectListProps) {
  const { t } = useTranslation()
  const value = useCvFieldValue(path)
  const items = Array.isArray(value) ? value : []
  const addItem = useCvDocumentStore((state) => state.addItem)
  const removeItem = useCvDocumentStore((state) => state.removeItem)
  const moveItem = useCvDocumentStore((state) => state.moveItem)
  const labelKey = fieldLabelKey(descriptor.schemaPath)
  const [overId, setOverId] = useState<string | null>(null)
  const highlight = useFieldHighlight(path)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const itemIds = items.map((_, index) => String(index))

  function handleDragOver(event: DragOverEvent) {
    setOverId(event.over && event.over.id !== event.active.id ? String(event.over.id) : null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setOverId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    moveItem(path, Number(active.id), Number(over.id))
  }

  return (
    <fieldset
      id={fieldElementId(path)}
      tabIndex={-1}
      className="flex flex-col gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400"
      {...highlight}
    >
      <legend className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {t(labelKey)}
        {descriptor.required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={() => setOverId(null)}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setOverId(null)}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {items.map((_, index) => (
            <SortableCard
              key={index}
              id={String(index)}
              isDropTarget={overId === String(index)}
              onMoveUp={() => moveItem(path, index, index - 1)}
              onMoveDown={() => moveItem(path, index, index + 1)}
              disableUp={index === 0}
              disableDown={index === items.length - 1}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {t(labelKey)} #{index + 1}
                </span>
                <button type="button" className={iconButtonClass} onClick={() => removeItem(path, index)}>
                  {t('actions.remove')}
                </button>
              </div>
              <FieldNode descriptor={descriptor.items} path={[...path, index]} hideLabel />
            </SortableCard>
          ))}
        </SortableContext>
      </DndContext>
      <FieldErrorList errors={errors} />
      <button type="button" className={addButtonClass} onClick={() => addItem(path, buildDefaultValue(descriptor.items))}>
        + {t('actions.add')}
      </button>
    </fieldset>
  )
}
