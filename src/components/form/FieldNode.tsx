import type { FieldDescriptor, Path } from '../../schema/types'
import { useCvValidation } from '../../store/validation'
import { TextField } from './fields/TextField'
import { NumberField } from './fields/NumberField'
import { SliderField } from './fields/SliderField'
import { PrimitiveArrayField } from './fields/PrimitiveArrayField'
import { RepeatableObjectList } from './fields/RepeatableObjectList'
import { ObjectGroup } from './fields/ObjectGroup'

interface FieldNodeProps {
  descriptor: FieldDescriptor
  path: Path
  /** Suppresses this node's own group heading - used when a container (e.g. a
   * repeatable list's per-item card) already renders an equivalent heading,
   * since an array item descriptor shares its schemaPath with the array. */
  hideLabel?: boolean
}

// A bounded slider is only usable for a reasonably narrow range (e.g. a 0-100
// skill level); a wide bounded range (e.g. a 1900-2100 "year" field) is
// unusable as a slider and gets a plain number input instead.
const MAX_SLIDER_RANGE = 100

/** Dispatches a schema field descriptor to the widget matching its kind and constraints. */
export function FieldNode({ descriptor, path, hideLabel }: FieldNodeProps) {
  const { errorsByPath } = useCvValidation()
  const errors = errorsByPath[path.join('.')]

  switch (descriptor.kind) {
    case 'string':
      return <TextField descriptor={descriptor} path={path} errors={errors} />
    case 'integer':
      return descriptor.minimum != null &&
        descriptor.maximum != null &&
        descriptor.maximum - descriptor.minimum <= MAX_SLIDER_RANGE ? (
        <SliderField descriptor={descriptor} path={path} errors={errors} />
      ) : (
        <NumberField descriptor={descriptor} path={path} errors={errors} />
      )
    case 'object':
      return <ObjectGroup descriptor={descriptor} path={path} hideLabel={hideLabel} />
    case 'array':
      return descriptor.items.kind === 'object' ? (
        <RepeatableObjectList descriptor={descriptor} path={path} errors={errors} />
      ) : (
        <PrimitiveArrayField descriptor={descriptor} path={path} errors={errors} />
      )
  }
}
