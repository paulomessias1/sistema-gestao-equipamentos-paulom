import type { LocationHistoryItem } from '../../types/location'
import { formatLocationDate } from '../../types/location'
import { DateText, Description, Event, EventTitle, HistoryCard, Timeline, Title } from './styles'

interface LocationHistoryCardProps {
  history: LocationHistoryItem[]
}

export function LocationHistoryCard({ history }: LocationHistoryCardProps) {
  return (
    <HistoryCard styles={{ body: { padding: 24 } }}>
      <Title>Histórico de movimentações</Title>

      <Timeline>
        {history.length === 0 ? (
          <Description>Nenhum evento registrado para este local.</Description>
        ) : (
          history.map((event) => (
            <Event key={event.id}>
              <DateText>{formatLocationDate(event.createdAt)}</DateText>
              <EventTitle>{event.title}</EventTitle>
              <Description>{event.description}</Description>
            </Event>
          ))
        )}
      </Timeline>
    </HistoryCard>
  )
}
