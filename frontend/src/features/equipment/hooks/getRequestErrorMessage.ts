import axios from 'axios'

// Converte erros do Axios ou do JavaScript em uma mensagem simples para a tela.
export function getRequestErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as any
    return (
      axiosError.response?.data?.message ??
      axiosError.message ??
      'Não foi possível completar a comunicação com a API.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Não foi possível completar a comunicação com a API.'
}
