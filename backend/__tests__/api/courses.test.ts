import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { GET, POST } from '@/app/api/courses/route'
import { NextRequest } from 'next/server'

// Mock del cliente Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
  getAuthUser: jest.fn(),
}))

import { createClient, getAuthUser } from '@/lib/supabase/server'

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockGetAuthUser = getAuthUser as jest.MockedFunction<typeof getAuthUser>

describe('GET /api/courses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('devuelve array de cursos publicados', async () => {
    const mockCourses = [
      {
        id: '1',
        title: 'Next.js Pro',
        is_published: true,
        instructor: { full_name: 'Ana López' },
        category: { name: 'Programación' },
        enrollments: [{ count: 42 }],
      },
    ]

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: mockCourses, error: null }),
        }),
      }),
    } as any)

    const req = new NextRequest('http://localhost:3001/api/courses')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual(mockCourses)
  })

  it('filtra por categoría cuando se proporciona query param', async () => {
    const categoryId = 'category-123'
    const mockCourses = [
      {
        id: '1',
        title: 'Python Avanzado',
        category_id: categoryId,
      },
    ]

    const mockQuery = {
      eq: jest.fn().mockResolvedValue({ data: mockCourses, error: null }),
    }

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue(mockQuery),
      }),
    } as any)

    const req = new NextRequest(`http://localhost:3001/api/courses?category=${categoryId}`)
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(mockQuery.eq).toHaveBeenCalledWith('category_id', categoryId)
    expect(body).toEqual(mockCourses)
  })

  it('devuelve error 500 si Supabase falla', async () => {
    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: { code: '42P01' } }),
        }),
      }),
    } as any)

    const req = new NextRequest('http://localhost:3001/api/courses')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body).toEqual({ error: 'Internal error' })
  })

  it('devuelve [] cuando no hay cursos publicados', async () => {
    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    } as any)

    const req = new NextRequest('http://localhost:3001/api/courses')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual([])
  })
})

describe('POST /api/courses', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('crea un curso si el usuario está autenticado', async () => {
    mockGetAuthUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    } as any)

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null }),
      }),
    } as any)

    const body = JSON.stringify({
      title: 'React Fundamentals',
      description: 'Learn React basics',
      category_id: 'cat-1',
      price: 29.99,
    })

    const req = new NextRequest('http://localhost:3001/api/courses', {
      method: 'POST',
      body,
    })

    const res = await POST(req)
    const responseBody = await res.json()

    expect(res.status).toBe(201)
    expect(responseBody).toEqual({ success: true })
  })

  it('devuelve 401 si no hay usuario autenticado', async () => {
    mockGetAuthUser.mockResolvedValue({
      data: { user: null },
      error: null,
    } as any)

    const req = new NextRequest('http://localhost:3001/api/courses', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' }),
    })

    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(401)
    expect(body).toEqual({ error: 'Unauthorized' })
  })

  it('devuelve 409 si hay error de unicidad en la BD', async () => {
    mockGetAuthUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    } as any)

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: { code: '23505' } }),
      }),
    } as any)

    const req = new NextRequest('http://localhost:3001/api/courses', {
      method: 'POST',
      body: JSON.stringify({ title: 'Duplicate Course' }),
    })

    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(409)
    expect(body).toEqual({ error: 'Conflict' })
  })
})
