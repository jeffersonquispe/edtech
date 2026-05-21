# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: integration.spec.ts >> Integration Tests - Complete Flows >> navegación general funciona sin errores
- Location: e2e\tests\integration.spec.ts:87:7

# Error details

```
Test timeout of 30000ms exceeded while setting up "studentPage".
```

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - link "E EdTech" [ref=e4] [cursor=pointer]:
        - /url: /
        - generic [ref=e5]: E
        - generic [ref=e6]: EdTech
      - generic [ref=e7]:
        - link "Ingresar" [ref=e8] [cursor=pointer]:
          - /url: /login
        - link "Registrarse" [ref=e9] [cursor=pointer]:
          - /url: /signup
  - main [ref=e10]:
    - generic [ref=e15]:
      - generic [ref=e16]:
        - generic [ref=e17]: E
        - generic [ref=e18]: EdTech
      - heading "Bienvenido de nuevo" [level=1] [ref=e19]
      - paragraph [ref=e20]: Ingresa a tu cuenta para continuar
      - generic [ref=e21]:
        - generic [ref=e22]:
          - generic [ref=e23]: Email
          - textbox "Email" [ref=e24]: student@example.com
        - generic [ref=e25]:
          - generic [ref=e26]: Contraseña
          - textbox "Contraseña" [ref=e27]: password123
        - paragraph [ref=e28]: Invalid login credentials
        - button "Ingresar" [ref=e29]
      - paragraph [ref=e30]:
        - text: ¿No tienes cuenta?
        - link "Regístrate" [ref=e31] [cursor=pointer]:
          - /url: /signup
  - button "🎤" [ref=e32]
  - button "Open Next.js Dev Tools" [ref=e38] [cursor=pointer]:
    - img [ref=e39]
  - alert [ref=e42]
```

# Test source

```ts
  1   | import { test as base, Page, BrowserContext, expect } from '@playwright/test'
  2   | import { LoginPage } from '../pages/login.page'
  3   | 
  4   | /**
  5   |  * Datos de prueba para estudiantes e instructores
  6   |  * En producción, estos deberían venir de una BD de test o factory
  7   |  */
  8   | export const testUsers = {
  9   |   student: {
  10  |     email: 'student@example.com',
  11  |     password: 'password123',
  12  |   },
  13  |   instructor: {
  14  |     email: 'instructor@example.com',
  15  |     password: 'password123',
  16  |   },
  17  |   anotherStudent: {
  18  |     email: 'student2@example.com',
  19  |     password: 'password123',
  20  |   },
  21  | }
  22  | 
  23  | /**
  24  |  * Custom fixtures para autenticación
  25  |  * Proporciona contextos pre-autenticados para tests
  26  |  */
  27  | export const test = base.extend<{
  28  |   studentContext: BrowserContext
  29  |   instructorContext: BrowserContext
  30  |   studentPage: Page
  31  |   instructorPage: Page
  32  |   authenticatedPage: Page
  33  | }>({
  34  |   /**
  35  |    * Fixture: studentContext
  36  |    * Crea un contexto de navegador autenticado como estudiante
  37  |    * Guarda el estado de autenticación en auth/student.json
  38  |    */
  39  |   studentContext: async ({ browser }, use) => {
  40  |     const context = await browser.newContext()
  41  |     const page = await context.newPage()
  42  | 
  43  |     try {
  44  |       // Login como estudiante
  45  |       const loginPage = new LoginPage(page)
  46  |       await loginPage.login(testUsers.student.email, testUsers.student.password)
  47  | 
  48  |       // Verificar que el login fue exitoso
  49  |       await expect(page).toHaveURL(/.*\//) // Debe estar en la página principal
  50  |       await page.waitForLoadState('networkidle')
  51  | 
  52  |       // Guardar el estado de autenticación para reutilizarlo
  53  |       await context.storageState({ path: 'e2e/.auth/student.json' })
  54  |     } catch (error) {
  55  |       console.error('Failed to authenticate as student:', error)
  56  |       throw error
  57  |     }
  58  | 
  59  |     await use(context)
  60  |     await context.close()
  61  |   },
  62  | 
  63  |   /**
  64  |    * Fixture: instructorContext
  65  |    * Crea un contexto de navegador autenticado como instructor
  66  |    * Guarda el estado de autenticación en auth/instructor.json
  67  |    */
  68  |   instructorContext: async ({ browser }, use) => {
  69  |     const context = await browser.newContext()
  70  |     const page = await context.newPage()
  71  | 
  72  |     try {
  73  |       // Login como instructor
  74  |       const loginPage = new LoginPage(page)
  75  |       await loginPage.login(testUsers.instructor.email, testUsers.instructor.password)
  76  | 
  77  |       // Verificar que el login fue exitoso
  78  |       await expect(page).toHaveURL(/.*\//) // Debe estar en la página principal
  79  |       await page.waitForLoadState('networkidle')
  80  | 
  81  |       // Guardar el estado de autenticación para reutilizarlo
  82  |       await context.storageState({ path: 'e2e/.auth/instructor.json' })
  83  |     } catch (error) {
  84  |       console.error('Failed to authenticate as instructor:', error)
  85  |       throw error
  86  |     }
  87  | 
  88  |     await use(context)
  89  |     await context.close()
  90  |   },
  91  | 
  92  |   /**
  93  |    * Fixture: studentPage
  94  |    * Proporciona una página pre-autenticada como estudiante
  95  |    * Útil para tests que requieren autenticación previa
  96  |    */
  97  |   studentPage: async ({ studentContext }, use) => {
  98  |     const page = await studentContext.newPage()
  99  |     try {
> 100 |       await page.goto('/')
      |                  ^ Error: page.goto: Target page, context or browser has been closed
  101 |       await use(page)
  102 |     } finally {
  103 |       await page.close()
  104 |     }
  105 |   },
  106 | 
  107 |   /**
  108 |    * Fixture: instructorPage
  109 |    * Proporciona una página pre-autenticada como instructor
  110 |    * Útil para tests que requieren autenticación como instructor
  111 |    */
  112 |   instructorPage: async ({ instructorContext }, use) => {
  113 |     const page = await instructorContext.newPage()
  114 |     try {
  115 |       await page.goto('/')
  116 |       await use(page)
  117 |     } finally {
  118 |       await page.close()
  119 |     }
  120 |   },
  121 | 
  122 |   /**
  123 |    * Fixture: authenticatedPage
  124 |    * Alias para studentPage - página autenticada como estudiante
  125 |    * Útil para tests generales que requieren un usuario autenticado
  126 |    */
  127 |   authenticatedPage: async ({ studentPage }, use) => {
  128 |     await use(studentPage)
  129 |   },
  130 | })
  131 | 
  132 | /**
  133 |  * Re-exportar las utilidades estándar de Playwright
  134 |  */
  135 | export { expect }
  136 | 
```