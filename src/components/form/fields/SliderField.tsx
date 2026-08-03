import { Slider } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import type { IntegerFieldDescriptor, Path } from '../../../schema/types'
import type { ValidationIssue } from '../../../schema/validator'
import { fieldLabelKey } from '../../../i18n'
import { fieldElementId } from '../../../schema/sectionStatus'
import { useCvDocumentStore, useCvFieldValue } from '../../../store/cvDocument'
import { useFieldHighlight } from '../useFieldHighlight'
import { FieldWrapper } from './FieldWrapper'

interface SliderFieldProps {
  descriptor: IntegerFieldDescriptor
  path: Path
  errors?: ValidationIssue[]
}

export function SliderField({ descriptor, path, errors }: SliderFieldProps) {
  const { t } = useTranslation()
  const value = useCvFieldValue(path)
  const setValue = useCvDocumentStore((state) => state.setValue)
  const highlight = useFieldHighlight(path)
  const minimum = descriptor.minimum ?? 0
  const maximum = descriptor.maximum ?? 100
  const current = typeof value === 'number' ? value : minimum

  return (
    <FieldWrapper
      labelKey={fieldLabelKey(descriptor.schemaPath)}
      required={descriptor.required}
      errors={errors}
      {...highlight}
    >
      <div className="flex items-center gap-3">
        <Slider.Root
          className="relative flex h-5 w-full touch-none items-center"
          min={minimum}
          max={maximum}
          step={1}
          value={[current]}
          onValueChange={([next]) => setValue(path, next)}
        >
          <Slider.Track className="relative h-1.5 grow rounded-full bg-neutral-200 dark:bg-neutral-700">
            <Slider.Range className="absolute h-full rounded-full bg-brand-500 dark:bg-brand-400" />
          </Slider.Track>
          <Slider.Thumb
            id={fieldElementId(path)}
            className="block h-4 w-4 rounded-full bg-brand-600 shadow focus:outline-none focus:ring-2 focus:ring-brand-400 dark:bg-brand-400"
            aria-label={t(fieldLabelKey(descriptor.schemaPath))}
          />
        </Slider.Root>
        <span className="w-10 shrink-0 text-right text-sm tabular-nums text-neutral-600 dark:text-neutral-400">
          {current}
        </span>
      </div>
    </FieldWrapper>
  )
}
