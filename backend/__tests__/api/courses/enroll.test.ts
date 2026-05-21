import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { POST } from '@/app/api/courses/[id]/enroll/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
  getAuthUser: jest.fn(),
}))

import { createClient, getAuthUser } from '@/lib/supabase/server'

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockGetAuthUser = getAuthUser as jest.MockedFunction<typeof getAuthUser>

describe('POST /api/courses/[id]/enroll', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('inscribe al usuario en el curso', async () => {
    const courseId = 'course-123'
    const userId = 'user-456'

    mockGetAuthUser.mockResolvedValue({
      data: { user: { id: userId } },
      error: null,
    } as any)

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null }),
      }),
    } as any)

    const req = new NextRequest('http://localhost:3001/api/courses/course-123/enroll', {
      method: 'POST',
    })

    const res = await POST(req, { params: Promise.resolve({ id: courseId }) })
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body).toEqual({ success: true })
  })

  it('devuelve 401 si no hay usuario autenticado', async () => {
    mockGetAuthUser.mockResolvedValue({
      data: { user: null },
      error: null,
    } as any)

    const req = new NextRequest('http://localhost:3001/api/courses/course-123/enroll', {
      method: 'POST',
    })

    const res = await POST(req, { params: Promise.resolve({ id: 'course-123' }) })
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body).toEqual({ error: 'Unauthorized' })
  })

  it('devuelve 409 si el usuario ya está inscrito (violación UNIQUE)', async () => {
    mockGetAuthUser.mockResolvedValue({
      data: { user: { id: 'user-456' } },
      error: null,
    } as any)

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: { code: '23505' } }),
      }),
    } as any)

    const req = new NextRequest('http://localhost:3001/api/courses/course-123/enroll', {
      method: 'POST',
    })

    const res = await POST(req, { params: Promise.resolve({ id: 'course-123' }) })
    const body = await res.json()

    expect(res.status).toBe(409)
    expect(body).toEqual({ error: 'Conflict' })
  })

  it('devuelve 400 si la FK al curso no existe', async () => {
    mockGetAuthUser.mockResolvedValue({
      data: { user: { id: 'user-456' } },
      error: null,
    } as any)

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: { code: '23503' } }),
      }),
    } as any)

    const req = new NextRequest('http://localhost:3001/api/courses/invalid-course/enroll', {
      method: 'POST',
    })

    const res = await POST(req, { params: Promise.resolve({ id: 'invalid-course' }) })
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body).toEqual({ error: 'Invalid reference' })
  })
})
