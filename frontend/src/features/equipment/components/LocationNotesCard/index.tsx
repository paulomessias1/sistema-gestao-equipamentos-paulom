import { NotesCard, NotesText, Title } from './styles'

interface LocationNotesCardProps {
  notes?: string | null
}

export function LocationNotesCard({ notes }: LocationNotesCardProps) {
  return (
    <NotesCard styles={{ body: { padding: 24 } }}>
      <Title>Descrição</Title>
      <NotesText>{notes || 'Nenhuma descrição cadastrada.'}</NotesText>
    </NotesCard>
  )
}
