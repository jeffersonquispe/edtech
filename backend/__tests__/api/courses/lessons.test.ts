import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { GET } from '@/app/api/courses/[id]/lessons/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

import { createClient } from '@/lib/supabase/server'

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

describe('GET /api/courses/[id]/lessons', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('devuelve lecciones ordenadas por position', async () => {
    const courseId = 'course-123'
    const mockLessons = [
      {
        id: 'lesson-1',
        title: 'Introducción',
        position: 1,
        content_md: '# Intro',
        video_url: null,
        course_id: courseId,
      },
      {
        id: 'lesson-2',
        title: 'Conceptos',
        position: 2,
        content_md: '# Concepts',
        video_url: 'https://youtube.com/embed/123',
        course_id: courseId,
      },
    ]

    const mockOrder = jest.fn().mockResolvedValue({ data: mockLessons, error: null })

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: mockOrder,
          }),
        }),
      }),
    } as any)

    const req = new NextRequest(`http://localhost:3001/api/courses/${courseId}/lessons`)
    const res = await GET(req, { params: Promise.resolve({ id: courseId }) })
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual(mockLessons)
    expect(mockOrder).toHaveBeenCalledWith('position', { ascending: true })
  })

  it('devuelve [] si el usuario no está inscrito (RLS)', async () => {
    const courseId = 'course-123'

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      }),
    } as any)

    const req = new NextRequest(`http://localhost:3001/api/courses/${courseId}/lessons`)
    const res = await GET(req, { params: Promise.resolve({ id: courseId }) })
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual([])
  })

  it('devuelve error 500 si Supabase falla', async () => {
    const courseId = 'course-123'

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: null, error: { code: '42P01' } }),
          }),
        }),
      }),
    } as any)

    const req = new NextRequest(`http://localhost:3001/api/courses/${courseId}/lessons`)
    const res = await GET(req, { params: Promise.resolve({ id: courseId }) })
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(body).toEqual({ error: 'Internal error' })
  })

  it('devuelve [] cuando data es null', async () => {
    const courseId = 'course-123'

    mockCreateClient.mockResolvedValue({
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    } as any)

    const req = new NextRequest(`http://localhost:3001/api/courses/${courseId}/lessons`)
    const res = await GET(req, { params: Promise.resolve({ id: courseId }) })
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual([])
  })
})
