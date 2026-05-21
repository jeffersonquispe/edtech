import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LogoutButton from './logout-button'
import { useRouter } from 'next/navigation'

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}))

import { createClient } from '@/lib/supabase/client'

const mockCreateClient = createClient as ReturnType<typeof vi.fn>
const mockUseRouter = useRouter as ReturnType<typeof vi.fn>

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el botón con texto Salir', () => {
    render(<LogoutButton />)

    expect(screen.getByRole('button', { name: /salir/i })).toBeInTheDocument()
  })

  it('ejecuta logout cuando se hace clic', async () => {
    const mockSignOut = vi.fn().mockResolvedValue({ error: null })
    const mockPush = vi.fn()
    const mockRefresh = vi.fn()

    vi.mocked(mockCreateClient).mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    } as any)

    vi.mocked(mockUseRouter).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    } as any)

    render(<LogoutButton />)

    const logoutButton = screen.getByRole('button', { name: /salir/i })
    fireEvent.click(logoutButton)

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('tiene estilos de hover aplicados', () => {
    render(<LogoutButton />)

    const button = screen.getByRole('button', { name: /salir/i })
    expect(button).toHaveClass('hover:text-zinc-700')
  })
})
