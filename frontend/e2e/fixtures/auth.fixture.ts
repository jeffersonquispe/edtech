import { test as base, Page, BrowserContext, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'

/**
 * Datos de prueba para estudiantes e instructores
 * En producción, estos deberían venir de una BD de test o factory
 */
export const testUsers = {
  student: {
    email: 'student@example.com',
    password: 'password123',
  },
  instructor: {
    email: 'instructor@example.com',
    password: 'password123',
  },
  anotherStudent: {
    email: 'student2@example.com',
    password: 'password123',
  },
}

/**
 * Custom fixtures para autenticación
 * Proporciona contextos pre-autenticados para tests
 */
export const test = base.extend<{
  studentContext: BrowserContext
  instructorContext: BrowserContext
  studentPage: Page
  instructorPage: Page
  authenticatedPage: Page
}>({
  /**
   * Fixture: studentContext
   * Crea un contexto de navegador autenticado como estudiante
   * Guarda el estado de autenticación en auth/student.json
   */
  studentContext: async ({ browser }, use) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    try {
      // Login como estudiante
      const loginPage = new LoginPage(page)
      await loginPage.login(testUsers.student.email, testUsers.student.password)

      // Verificar que el login fue exitoso
      await expect(page).toHaveURL(/.*\//) // Debe estar en la página principal
      await page.waitForLoadState('networkidle')

      // Guardar el estado de autenticación para reutilizarlo
      await context.storageState({ path: 'e2e/.auth/student.json' })
    } catch (error) {
      console.error('Failed to authenticate as student:', error)
      throw error
    }

    await use(context)
    await context.close()
  },

  /**
   * Fixture: instructorContext
   * Crea un contexto de navegador autenticado como instructor
   * Guarda el estado de autenticación en auth/instructor.json
   */
  instructorContext: async ({ browser }, use) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    try {
      // Login como instructor
      const loginPage = new LoginPage(page)
      await loginPage.login(testUsers.instructor.email, testUsers.instructor.password)

      // Verificar que el login fue exitoso
      await expect(page).toHaveURL(/.*\//) // Debe estar en la página principal
      await page.waitForLoadState('networkidle')

      // Guardar el estado de autenticación para reutilizarlo
      await context.storageState({ path: 'e2e/.auth/instructor.json' })
    } catch (error) {
      console.error('Failed to authenticate as instructor:', error)
      throw error
    }

    await use(context)
    await context.close()
  },

  /**
   * Fixture: studentPage
   * Proporciona una página pre-autenticada como estudiante
   * Útil para tests que requieren autenticación previa
   */
  studentPage: async ({ studentContext }, use) => {
    const page = await studentContext.newPage()
    try {
      await page.goto('/')
      await use(page)
    } finally {
      await page.close()
    }
  },

  /**
   * Fixture: instructorPage
   * Proporciona una página pre-autenticada como instructor
   * Útil para tests que requieren autenticación como instructor
   */
  instructorPage: async ({ instructorContext }, use) => {
    const page = await instructorContext.newPage()
    try {
      await page.goto('/')
      await use(page)
    } finally {
      await page.close()
    }
  },

  /**
   * Fixture: authenticatedPage
   * Alias para studentPage - página autenticada como estudiante
   * Útil para tests generales que requieren un usuario autenticado
   */
  authenticatedPage: async ({ studentPage }, use) => {
    await use(studentPage)
  },
})

/**
 * Re-exportar las utilidades estándar de Playwright
 */
export { expect }
