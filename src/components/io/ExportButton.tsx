import { useTranslation } from 'react-i18next'
import { useCvDocumentStore } from '../../store/cvDocument'
import { serializeToYaml } from '../../yaml/serialize'
import { downloadTextFile } from '../../yaml/download'
import { addButtonClass } from '../form/fields/inputStyles'

export function ExportButton() {
  const { t } = useTranslation()
  const cvDocument = useCvDocumentStore((state) => state.document)

  return (
    <button
      type="button"
      className={addButtonClass}
      onClick={() => downloadTextFile('cv.yaml', serializeToYaml(cvDocument))}
    >
      {t('actions.export')}
    </button>
  )
}
