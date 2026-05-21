import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from './page'
import { useRouter } from 'next/navigation'

// Mock del cliente Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}))

// Mock del router de Next.js
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}))

import { createClient } from '@/lib/supabase/client'

const mockCreateClient = createClient as ReturnType<typeof vi.fn>
const mockUseRouter = useRouter as ReturnType<typeof vi.fn>

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el formulario de login', () => {
    render(<LoginPage />)

    expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i, { selector: 'input' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
  })

  it('muestra enlace a página de signup', () => {
    render(<LoginPage />)

    const signupLink = screen.getByRole('link', { name: /no tienes cuenta/i })
    expect(signupLink).toHaveAttribute('href', '/signup')
  })

  it('realiza login exitoso y redirige', async () => {
    const mockPush = vi.fn()
    const mockRefresh = vi.fn()

    vi.mocked(mockUseRouter).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    } as any)

    render(<LoginPage />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const passwordInput = screen.getByLabelText(/contraseña/i, { selector: 'input' })
    const submitButton = screen.getByRole('button', { name: /ingresar/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('muestra mensaje de error cuando login falla', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    })

    vi.mocked(mockCreateClient).mockReturnValue({
      auth: {
        signInWithPassword: mockSignIn,
      },
    } as any)

    render(<LoginPage />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const passwordInput = screen.getByLabelText(/contraseña/i, { selector: 'input' })
    const submitButton = screen.getByRole('button', { name: /ingresar/i })

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials')).toBeInTheDocument()
    })
  })

  it('deshabilita el botón mientras se procesa el login', async () => {
    const mockSignIn = vi.fn(() => new Promise(() => {})) // Never resolves

    vi.mocked(mockCreateClient).mockReturnValue({
      auth: {
        signInWithPassword: mockSignIn,
      },
    } as any)

    render(<LoginPage />)

    const submitButton = screen.getByRole('button', { name: /ingresar/i })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })
})
