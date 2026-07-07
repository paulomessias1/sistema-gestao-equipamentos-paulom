import { Form, Input, Select } from 'antd'
import { useEffect } from 'react'
import {
  getLocationStatusLabel,
  type LocationDetails,
  type LocationStatus,
} from '../../types/location'
import { CurrentStatusText, StatusModal } from './styles'

export interface LocationStatusFormValues {
  status: LocationStatus
  note?: string
}

interface LocationStatusModalProps {
  location?: LocationDetails
  confirmLoading?: boolean
  open: boolean
  statusOptions: LocationStatus[]
  onCancel: () => void
  onSubmit: (values: LocationStatusFormValues) => void
}

export function LocationStatusModal({
  location,
  confirmLoading,
  open,
  statusOptions,
  onCancel,
  onSubmit,
}: LocationStatusModalProps) {
  const [form] = Form.useForm<LocationStatusFormValues>()

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        status: location?.status,
        note: '',
      })
    }
  }, [location, form, open])

  function handleSubmit() {
    form
      .validateFields()
      .then((values) => onSubmit(values))
      .catch(() => undefined)
  }

  return (
    <StatusModal
      centered
      destroyOnClose
      open={open}
      title="Alterar situação"
      okText="Salvar"
      cancelText="Cancelar"
      confirmLoading={confirmLoading}
      width={480}
      styles={{
        mask: { backdropFilter: 'blur(2px)', background: 'rgb(0 0 0 / 45%)' },
      }}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nova situação"
          name="status"
          rules={[{ required: true, message: 'Selecione o novo status.' }]}
        >
          <Select
            placeholder="Selecione a situação..."
            options={statusOptions.map((status) => ({
              label: getLocationStatusLabel(status),
              value: status,
            }))}
          />
        </Form.Item>

        <Form.Item label="Observação" name="note">
          <Input.TextArea placeholder="Ex: Local fechado para reforma." />
        </Form.Item>
      </Form>

      <CurrentStatusText>
        Situação atual: {location ? getLocationStatusLabel(location.status) : '-'}
      </CurrentStatusText>
    </StatusModal>
  )
}
