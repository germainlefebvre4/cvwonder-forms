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
import { fieldLabelKey } from '../../../i18n'
import { fieldElementId } from '../../../schema/sectionStatus'
import { useCvDocumentStore, useCvFieldValue } from '../../../store/cvDocument'
import { useCvValidation } from '../../../store/validation'
import { FieldErrorList } from './FieldErrorList'
import { addButtonClass, dragHandleClass, dragOverIndicatorClass, iconButtonClass, railClass, textInputClass } from './inputStyles'

interface PrimitiveArrayFieldProps {
  descriptor: ArrayFieldDescriptor
  path: Path
  errors?: ValidationIssue[]
}

interface SortableRowProps {
  id: string
  isDropTarget: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  disableUp: boolean
  disableDown: boolean
  children: ReactNode
}

function SortableRow({ id, isDropTarget, onMoveUp, onMoveDown, disableUp, disableDown, children }: SortableRowProps) {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-start gap-2 ${isDropTarget ? dragOverIndicatorClass : ''} ${isDragging ? 'opacity-50' : ''}`}
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
      {children}
    </div>
  )
}

export function PrimitiveArrayField({ descriptor, path, errors }: PrimitiveArrayFieldProps) {
  const { t } = useTranslation()
  const { errorsByPath } = useCvValidation()
  const value = useCvFieldValue(path)
  const items = Array.isArray(value) ? value : []
  const setValue = useCvDocumentStore((state) => state.setValue)
  const addItem = useCvDocumentStore((state) => state.addItem)
  const removeItem = useCvDocumentStore((state) => state.removeItem)
  const moveItem = useCvDocumentStore((state) => state.moveItem)
  const labelKey = fieldLabelKey(descriptor.schemaPath)
  const [overId, setOverId] = useState<string | null>(null)

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
      className="flex flex-col gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400"
    >
      <legend className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
          {items.map((item, index) => (
            <SortableRow
              key={index}
              id={String(index)}
              isDropTarget={overId === String(index)}
              onMoveUp={() => moveItem(path, index, index - 1)}
              onMoveDown={() => moveItem(path, index, index + 1)}
              disableUp={index === 0}
              disableDown={index === items.length - 1}
            >
              <textarea
                rows={2}
                value={typeof item === 'string' ? item : ''}
                onChange={(event) => setValue([...path, index], event.target.value)}
                className={`${textInputClass(Boolean(errorsByPath[[...path, index].join('.')]?.length))} flex-1`}
              />
              <button type="button" className={iconButtonClass} onClick={() => removeItem(path, index)}>
                {t('actions.remove')}
              </button>
            </SortableRow>
          ))}
        </SortableContext>
      </DndContext>
      <FieldErrorList errors={errors} />
      <button type="button" className={addButtonClass} onClick={() => addItem(path, '')}>
        + {t('actions.add')}
      </button>
    </fieldset>
  )
}
