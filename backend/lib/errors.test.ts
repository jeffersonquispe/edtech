import { describe, it, expect } from '@jest/globals'
import { mapPostgresError, ErrorResponse } from './errors'

describe('mapPostgresError', () => {
  it('devuelve 409 Conflict para error de unicidad (23505)', () => {
    const err = { code: '23505', message: 'duplicate key value' }
    const result = mapPostgresError(err)

    expect(result).toEqual({ status: 409, message: 'Conflict' })
  })

  it('devuelve 400 Invalid reference para error de FK (23503)', () => {
    const err = { code: '23503', message: 'insert or update on table violates foreign key' }
    const result = mapPostgresError(err)

    expect(result).toEqual({ status: 400, message: 'Invalid reference' })
  })

  it('devuelve 500 Internal error para código desconocido', () => {
    const err = { code: '42P01', message: 'undefined table' }
    const result = mapPostgresError(err)

    expect(result).toEqual({ status: 500, message: 'Internal error' })
  })

  it('devuelve 500 si error no tiene código', () => {
    const err = new Error('Unknown error')
    const result = mapPostgresError(err)

    expect(result).toEqual({ status: 500, message: 'Internal error' })
  })

  it('devuelve 500 si el parámetro es null o undefined', () => {
    expect(mapPostgresError(null)).toEqual({ status: 500, message: 'Internal error' })
    expect(mapPostgresError(undefined)).toEqual({ status: 500, message: 'Internal error' })
  })

  it('devuelve 500 para string vacío', () => {
    const result = mapPostgresError('')
    expect(result).toEqual({ status: 500, message: 'Internal error' })
  })
})
