# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: enrollment.spec.ts >> Enrollment Flow >> estudiante puede inscribirse en un curso
- Location: e2e\tests\enrollment.spec.ts:18:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
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
  1   | import { Page, Locator, expect } from '@playwright/test'
  2   | 
  3   | /**
  4   |  * Base Page Object - contiene métodos comunes para todas las páginas
  5   |  */
  6   | export class BasePage {
  7   |   constructor(protected page: Page) {}
  8   | 
  9   |   async goto(path: string) {
> 10  |     await this.page.goto(path)
      |                     ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  11  |   }
  12  | 
  13  |   async click(locator: Locator | string) {
  14  |     if (typeof locator === 'string') {
  15  |       await this.page.click(locator)
  16  |     } else {
  17  |       await locator.click()
  18  |     }
  19  |   }
  20  | 
  21  |   async fill(locator: Locator | string, text: string) {
  22  |     if (typeof locator === 'string') {
  23  |       await this.page.fill(locator, text)
  24  |     } else {
  25  |       await locator.fill(text)
  26  |     }
  27  |   }
  28  | 
  29  |   async selectOption(locator: Locator | string, value: string) {
  30  |     if (typeof locator === 'string') {
  31  |       await this.page.selectOption(locator, value)
  32  |     } else {
  33  |       await locator.selectOption(value)
  34  |     }
  35  |   }
  36  | 
  37  |   async getByRole(role: string, options?: Parameters<Page['getByRole']>[1]) {
  38  |     return this.page.getByRole(role, options)
  39  |   }
  40  | 
  41  |   async getByText(text: string | RegExp, options?: Parameters<Page['getByText']>[1]) {
  42  |     return this.page.getByText(text, options)
  43  |   }
  44  | 
  45  |   async getByLabel(text: string | RegExp, options?: Parameters<Page['getByLabel']>[1]) {
  46  |     return this.page.getByLabel(text, options)
  47  |   }
  48  | 
  49  |   async getByPlaceholder(text: string | RegExp) {
  50  |     return this.page.getByPlaceholder(text)
  51  |   }
  52  | 
  53  |   async waitForURL(urlPattern: RegExp | string, timeout?: number) {
  54  |     await this.page.waitForURL(urlPattern, { timeout })
  55  |   }
  56  | 
  57  |   async waitForNavigation() {
  58  |     await this.page.waitForLoadState('networkidle')
  59  |   }
  60  | 
  61  |   async isVisible(locator: Locator | string) {
  62  |     if (typeof locator === 'string') {
  63  |       return await this.page.locator(locator).isVisible()
  64  |     } else {
  65  |       return await locator.isVisible()
  66  |     }
  67  |   }
  68  | 
  69  |   async expectToBeVisible(locator: Locator | string) {
  70  |     if (typeof locator === 'string') {
  71  |       await expect(this.page.locator(locator)).toBeVisible()
  72  |     } else {
  73  |       await expect(locator).toBeVisible()
  74  |     }
  75  |   }
  76  | 
  77  |   async expectToBeHidden(locator: Locator | string) {
  78  |     if (typeof locator === 'string') {
  79  |       await expect(this.page.locator(locator)).toBeHidden()
  80  |     } else {
  81  |       await expect(locator).toBeHidden()
  82  |     }
  83  |   }
  84  | 
  85  |   async expectToContainText(locator: Locator | string, text: string) {
  86  |     if (typeof locator === 'string') {
  87  |       await expect(this.page.locator(locator)).toContainText(text)
  88  |     } else {
  89  |       await expect(locator).toContainText(text)
  90  |     }
  91  |   }
  92  | 
  93  |   async getCurrentURL(): Promise<string> {
  94  |     return this.page.url()
  95  |   }
  96  | 
  97  |   async reload() {
  98  |     await this.page.reload()
  99  |   }
  100 | 
  101 |   async goBack() {
  102 |     await this.page.goBack()
  103 |   }
  104 | 
  105 |   async getTitle(): Promise<string> {
  106 |     return this.page.title()
  107 |   }
  108 | }
  109 | 
```