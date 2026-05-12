export interface ErrorResponse {
  status: number;
  message: string;
}

export function mapPostgresError(err: unknown): ErrorResponse {
  const error = err as { code?: string; message?: string };

  if (error.code === '23505') {
    return { status: 409, message: 'Conflict' };
  }

  if (error.code === '23503') {
    return { status: 400, message: 'Invalid reference' };
  }

  return { status: 500, message: 'Internal error' };
}
