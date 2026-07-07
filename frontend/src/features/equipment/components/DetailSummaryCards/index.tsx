import { Description, Grid, Label, SummaryCard, Value } from './styles'

export interface LocationDetailSummary {
  id: string
  title: string
  value: number | string
  description?: string
}

interface DetailSummaryCardsProps {
  summaries: LocationDetailSummary[]
}

export function DetailSummaryCards({ summaries }: DetailSummaryCardsProps) {
  return (
    <Grid aria-label="Resumo do local">
      {summaries.map((summary) => (
        <SummaryCard key={summary.id} styles={{ body: { padding: 16 } }}>
          <Label>{summary.title}</Label>
          <Value>{summary.value}</Value>
          <Description>{summary.description}</Description>
        </SummaryCard>
      ))}
    </Grid>
  )
}
