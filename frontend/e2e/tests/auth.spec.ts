import { test, expect } from '../fixtures/auth.fixture'
import { LoginPage } from '../pages/login.page'

test.describe('Authentication', () => {
  test('puede hacer login como estudiante correctamente', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page)

    // Act
    await loginPage.login('student@example.com', 'password123')

    // Assert
    await expect(page).toHaveURL(/.*\//)
    await loginPage.expectCoursesPageVisible?.()
  })

  test('muestra error con credenciales inválidas', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page)

    // Act
    await loginPage.goto('/login')
    await loginPage.fillEmail('invalid@example.com')
    await loginPage.fillPassword('wrongpassword')
    await loginPage.submitForm()

    // Assert
    await loginPage.expectErrorMessage()
  })

  test('redirige a login si no está autenticado', async ({ page }) => {
    // Intentar acceder a dashboard sin autenticación
    await page.goto('/dashboard/student')

    // Debería redirigir a login
    await expect(page).toHaveURL(/.*\/login/)
  })

  test('usuario puede hacer logout correctamente', async ({ studentPage }) => {
    // Arrange - ya está autenticado
    const logoutButton = studentPage.getByRole('button', { name: /salir|logout/i })

    // Act
    await logoutButton.click()

    // Assert
    await expect(studentPage).toHaveURL(/.*\/login/)
  })
})
