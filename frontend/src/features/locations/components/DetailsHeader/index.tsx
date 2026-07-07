import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import AutorenewOutlined from '@mui/icons-material/AutorenewOutlined'
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import { Button } from 'antd'
import type { LocationDetails } from '../../types/location'
import {
  Actions,
  BackButton,
  BrandButton,
  Code,
  HeaderContainer,
  Title,
  TitleGroup,
  TitleRow,
} from './styles'
import styled from 'styled-components'

const LocationStatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  background-color: ${props => props.$status === 'ACTIVE' ? '#e6fffb' : '#f5f5f5'};
  color: ${props => props.$status === 'ACTIVE' ? '#08979c' : '#595959'};
  border: 1px solid ${props => props.$status === 'ACTIVE' ? '#87e8de' : '#d9d9d9'};
`

interface DetailsHeaderProps {
  location: LocationDetails
  onBack: () => void
  onChangeStatus: () => void
  onEdit: () => void
  onRemove: () => void
}

export function DetailsHeader({
  location,
  onBack,
  onChangeStatus,
  onEdit,
  onRemove,
}: DetailsHeaderProps) {
  return (
    <HeaderContainer>
      <TitleGroup>
        <BackButton icon={<ArrowBackOutlined fontSize="small" />} type="text" onClick={onBack}>
          Voltar para locais
        </BackButton>

        <TitleRow>
          <Title>{location.name}</Title>
          <LocationStatusBadge $status={location.status}>
            {location.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
          </LocationStatusBadge>
        </TitleRow>

        <Code>{location.code}</Code>
      </TitleGroup>

      <Actions>
        <BrandButton type="primary" icon={<EditOutlined fontSize="small" />} onClick={onEdit}>
          Editar
        </BrandButton>

        <Button icon={<AutorenewOutlined fontSize="small" />} onClick={onChangeStatus}>
          Alterar situação
        </Button>

        <Button danger icon={<DeleteOutlineOutlined fontSize="small" />} onClick={onRemove}>
          Excluir
        </Button>
      </Actions>
    </HeaderContainer>
  )
}
