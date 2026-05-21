# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> redirige a login si no está autenticado
- Location: e2e\tests\auth.spec.ts:31:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/dashboard/student", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '../fixtures/auth.fixture'
  2  | import { LoginPage } from '../pages/login.page'
  3  | 
  4  | test.describe('Authentication', () => {
  5  |   test('puede hacer login como estudiante correctamente', async ({ page }) => {
  6  |     // Arrange
  7  |     const loginPage = new LoginPage(page)
  8  | 
  9  |     // Act
  10 |     await loginPage.login('student@example.com', 'password123')
  11 | 
  12 |     // Assert
  13 |     await expect(page).toHaveURL(/.*\//)
  14 |     await loginPage.expectCoursesPageVisible?.()
  15 |   })
  16 | 
  17 |   test('muestra error con credenciales inválidas', async ({ page }) => {
  18 |     // Arrange
  19 |     const loginPage = new LoginPage(page)
  20 | 
  21 |     // Act
  22 |     await loginPage.goto('/login')
  23 |     await loginPage.fillEmail('invalid@example.com')
  24 |     await loginPage.fillPassword('wrongpassword')
  25 |     await loginPage.submitForm()
  26 | 
  27 |     // Assert
  28 |     await loginPage.expectErrorMessage()
  29 |   })
  30 | 
  31 |   test('redirige a login si no está autenticado', async ({ page }) => {
  32 |     // Intentar acceder a dashboard sin autenticación
> 33 |     await page.goto('/dashboard/student')
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  34 | 
  35 |     // Debería redirigir a login
  36 |     await expect(page).toHaveURL(/.*\/login/)
  37 |   })
  38 | 
  39 |   test('usuario puede hacer logout correctamente', async ({ studentPage }) => {
  40 |     // Arrange - ya está autenticado
  41 |     const logoutButton = studentPage.getByRole('button', { name: /salir|logout/i })
  42 | 
  43 |     // Act
  44 |     await logoutButton.click()
  45 | 
  46 |     // Assert
  47 |     await expect(studentPage).toHaveURL(/.*\/login/)
  48 |   })
  49 | })
  50 | 
```