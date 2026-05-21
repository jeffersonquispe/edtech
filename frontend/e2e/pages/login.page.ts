import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base.page'

export class LoginPage extends BasePage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly errorMessage: Locator
  readonly signupLink: Locator
  readonly pageTitle: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = page.getByRole('textbox', { name: /email/i })
    this.passwordInput = page.getByLabel(/contraseña/i, { selector: 'input' })
    this.loginButton = page.getByRole('button', { name: /ingresar/i })
    this.errorMessage = page.getByText(/credenciales inválidas|invalid login credentials/i)
    this.signupLink = page.getByRole('link', { name: /no tienes cuenta|crear una/i })
    this.pageTitle = page.getByText(/bienvenido|welcome/i)
  }

  async goto() {
    await super.goto('/login')
  }

  async login(email: string, password: string) {
    await this.goto()
    await this.fill(this.emailInput, email)
    await this.fill(this.passwordInput, password)
    await this.click(this.loginButton)
    // Esperar a que la navegación se complete
    await this.waitForNavigation()
  }

  async expectErrorMessage() {
    await expect(this.errorMessage).toBeVisible()
  }

  async expectSignupLink() {
    await expect(this.signupLink).toBeVisible()
  }

  async expectPageTitle() {
    await expect(this.pageTitle).toBeVisible()
  }

  async clickSignupLink() {
    await this.click(this.signupLink)
    await this.waitForURL(/\/signup/)
  }

  async expectToBeOnLoginPage() {
    await this.expectToBeVisible(this.pageTitle)
    await expect(this.page).toHaveURL(/.*\/login/)
  }

  async submitWithoutEmail(password: string) {
    await this.goto()
    await this.fill(this.passwordInput, password)
    await this.click(this.loginButton)
  }

  async submitWithoutPassword(email: string) {
    await this.goto()
    await this.fill(this.emailInput, email)
    await this.click(this.loginButton)
  }

  async fillEmail(email: string) {
    await this.fill(this.emailInput, email)
  }

  async fillPassword(password: string) {
    await this.fill(this.passwordInput, password)
  }

  async submitForm() {
    await this.click(this.loginButton)
    await this.waitForNavigation()
  }
}
