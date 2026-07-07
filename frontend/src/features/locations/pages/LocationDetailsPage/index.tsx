import { App as AntDesignApp, Alert } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '../../../../app/layout/AppLayout'
import { DetailsHeader } from '../../components/DetailsHeader'
import { DetailSummaryCards, type LocationDetailSummary } from '../../components/DetailSummaryCards'
import { LocationInfoCard } from '../../components/LocationInfoCard'
import { LocationNotesCard } from '../../components/LocationNotesCard'
import { LocationHistoryCard } from '../../components/LocationHistoryCard'
import { useLocationDetails } from '../../hooks/useLocationDetails'
import { useLocationEquipment } from '../../hooks/useLocationEquipment'
import { useLocationHistory } from '../../hooks/useLocationHistory'
import { useDeleteLocation } from '../../hooks/useDeleteLocation'
import { useUpdateLocation } from '../../hooks/useUpdateLocation'
import { useUpdateLocationStatus } from '../../hooks/useUpdateLocationStatus'
import { getRequestErrorMessage } from '../../../../shared/http/getRequestErrorMessage'
import {
  LocationFormModal,
  type LocationFormMode,
  type LocationFormValues,
} from '../../components/LocationFormModal'
import { LocationStatusModal, type LocationStatusFormValues } from '../../components/LocationStatusModal'
import { LocationRemoveModal } from '../../components/LocationRemoveModal'
import { locationStatusOptions, locationTypeOptions } from '../../types/location'
import { useState } from 'react'
import { Container, ContentGrid, MainColumn, SideColumn, StarterBox } from './styles'

export function LocationDetailsPage() {
  const { message: messageApi } = AntDesignApp.useApp()
  const navigate = useNavigate()
  const { locationId } = useParams()

  const locationQuery = useLocationDetails(locationId)
  const equipmentQuery = useLocationEquipment(locationId)
  const historyQuery = useLocationHistory(locationId)

  const deleteLocation = useDeleteLocation()
  const updateLocation = useUpdateLocation()
  const updateLocationStatus = useUpdateLocationStatus()

  const [formMode, setFormMode] = useState<LocationFormMode>('create')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [locationInForm, setLocationInForm] = useState<any>()
  const [locationToRemove, setLocationToRemove] = useState<any>()
  const [locationInStatus, setLocationInStatus] = useState<any>()

  const location = locationQuery.data
  const equipmentData = equipmentQuery.data?.data ?? []
  const historyData = historyQuery.data?.data ?? []

  const isSavingForm = updateLocation.isLoading
  const isSavingStatus = updateLocationStatus.isLoading
  const isDeleting = deleteLocation.isLoading

  const isLoading =
    locationQuery.isLoading ||
    equipmentQuery.isLoading ||
    historyQuery.isLoading

  const loadError =
    locationQuery.errorMessage ||
    equipmentQuery.errorMessage ||
    historyQuery.errorMessage

  if (isLoading) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <StarterBox>Carregando detalhes do local...</StarterBox>
        </Container>
      </AppLayout>
    )
  }

  if (loadError || !location) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          {loadError && (
            <Alert
              showIcon
              message="Erro ao carregar detalhes"
              description={loadError}
              type="error"
              style={{ marginBottom: 20 }}
            />
          )}
          <StarterBox>Localização não encontrada.</StarterBox>
        </Container>
      </AppLayout>
    )
  }

  const activeLocation = location

  const summaries: LocationDetailSummary[] = [
    {
      id: 'total',
      title: 'Total Equipamentos',
      value: activeLocation.equipmentSummary?.total ?? 0,
      description: 'Vinculados a este local',
    },
    {
      id: 'available',
      title: 'Disponíveis',
      value: activeLocation.equipmentSummary?.available ?? 0,
      description: 'Prontos para uso',
    },
    {
      id: 'maintenance',
      title: 'Em Manutenção',
      value: activeLocation.equipmentSummary?.inMaintenance ?? 0,
      description: 'Sendo reparados',
    },
    {
      id: 'inactive',
      title: 'Inativos',
      value: activeLocation.equipmentSummary?.inactive ?? 0,
      description: 'Fora de serviço',
    },
  ]

  function handleEditLocation() {
    setFormMode('edit')
    setLocationInForm(activeLocation)
    setIsFormModalOpen(true)
  }

  function handleCloseFormModal() {
    setIsFormModalOpen(false)
    setLocationInForm(undefined)
  }

  async function handleSubmitLocationForm(values: LocationFormValues) {
    const payload = {
      code: values.code.trim(),
      name: values.name.trim(),
      type: values.type!,
      building: values.building?.trim() || undefined,
      floor: values.floor?.trim() || undefined,
      room: values.room?.trim() || undefined,
      description: values.description?.trim() || null,
      status: values.status,
    }

    try {
      await updateLocation.update({
        locationId: activeLocation.id,
        payload,
      })
      messageApi.success('Local atualizado com sucesso.')
      await locationQuery.reload()
      handleCloseFormModal()
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  async function handleConfirmRemoveLocation() {
    try {
      await deleteLocation.remove(activeLocation.id)
      messageApi.success('Local excluído com sucesso.')
      navigate('/locations')
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
      setLocationToRemove(undefined)
    }
  }

  async function handleSubmitStatusModal(values: LocationStatusFormValues) {
    try {
      await updateLocationStatus.updateStatus({
        locationId: activeLocation.id,
        payload: {
          status: values.status,
          note: values.note?.trim() || null,
        },
      })
      messageApi.success('Situação atualizada com sucesso.')
      await locationQuery.reload()
      setLocationInStatus(undefined)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  return (
    <AppLayout currentPage="Detalhes">
      <Container>
        <DetailsHeader
          location={activeLocation}
          onBack={() => navigate('/locations')}
          onEdit={handleEditLocation}
          onChangeStatus={() => setLocationInStatus(activeLocation)}
          onRemove={() => setLocationToRemove(activeLocation)}
        />

        <DetailSummaryCards summaries={summaries} />

        <ContentGrid>
          <MainColumn>
            <LocationInfoCard location={activeLocation} />
            <LocationNotesCard notes={activeLocation.description} />
          </MainColumn>

          <SideColumn>
            <LocationHistoryCard history={historyData} />
          </SideColumn>
        </ContentGrid>

        <LocationFormModal
          location={locationInForm}
          mode={formMode}
          open={isFormModalOpen}
          confirmLoading={isSavingForm}
          statusOptions={locationStatusOptions}
          typeOptions={locationTypeOptions}
          onCancel={handleCloseFormModal}
          onSubmit={handleSubmitLocationForm}
        />

        <LocationRemoveModal
          location={locationToRemove}
          open={Boolean(locationToRemove)}
          confirmLoading={isDeleting}
          onCancel={() => setLocationToRemove(undefined)}
          onConfirm={handleConfirmRemoveLocation}
        />

        <LocationStatusModal
          location={locationInStatus}
          open={Boolean(locationInStatus)}
          confirmLoading={isSavingStatus}
          statusOptions={locationStatusOptions}
          onCancel={() => setLocationInStatus(undefined)}
          onSubmit={handleSubmitStatusModal}
        />
      </Container>
    </AppLayout>
  )
}
