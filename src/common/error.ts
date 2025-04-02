type Props = {
  message: string
  stack?: string
  status?: number
}

export function CustomError(error: unknown): Props {
  if (typeof error === 'object' && error !== null) {
    const { message, stack, status } = error as Record<string, unknown>

    return {
      message: typeof message === 'string' ? message : JSON.stringify(error),
      stack: typeof stack === 'string' ? stack : undefined,
      status: typeof status === 'number' ? status : undefined,
    }
  }

  return { message: JSON.stringify(error) }
}
