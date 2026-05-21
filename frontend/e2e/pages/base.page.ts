import { Page, Locator, expect } from '@playwright/test'

/**
 * Base Page Object - contiene métodos comunes para todas las páginas
 */
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path)
  }

  async click(locator: Locator | string) {
    if (typeof locator === 'string') {
      await this.page.click(locator)
    } else {
      await locator.click()
    }
  }

  async fill(locator: Locator | string, text: string) {
    if (typeof locator === 'string') {
      await this.page.fill(locator, text)
    } else {
      await locator.fill(text)
    }
  }

  async selectOption(locator: Locator | string, value: string) {
    if (typeof locator === 'string') {
      await this.page.selectOption(locator, value)
    } else {
      await locator.selectOption(value)
    }
  }

  async getByRole(role: string, options?: Parameters<Page['getByRole']>[1]) {
    return this.page.getByRole(role, options)
  }

  async getByText(text: string | RegExp, options?: Parameters<Page['getByText']>[1]) {
    return this.page.getByText(text, options)
  }

  async getByLabel(text: string | RegExp, options?: Parameters<Page['getByLabel']>[1]) {
    return this.page.getByLabel(text, options)
  }

  async getByPlaceholder(text: string | RegExp) {
    return this.page.getByPlaceholder(text)
  }

  async waitForURL(urlPattern: RegExp | string, timeout?: number) {
    await this.page.waitForURL(urlPattern, { timeout })
  }

  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle')
  }

  async isVisible(locator: Locator | string) {
    if (typeof locator === 'string') {
      return await this.page.locator(locator).isVisible()
    } else {
      return await locator.isVisible()
    }
  }

  async expectToBeVisible(locator: Locator | string) {
    if (typeof locator === 'string') {
      await expect(this.page.locator(locator)).toBeVisible()
    } else {
      await expect(locator).toBeVisible()
    }
  }

  async expectToBeHidden(locator: Locator | string) {
    if (typeof locator === 'string') {
      await expect(this.page.locator(locator)).toBeHidden()
    } else {
      await expect(locator).toBeHidden()
    }
  }

  async expectToContainText(locator: Locator | string, text: string) {
    if (typeof locator === 'string') {
      await expect(this.page.locator(locator)).toContainText(text)
    } else {
      await expect(locator).toContainText(text)
    }
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url()
  }

  async reload() {
    await this.page.reload()
  }

  async goBack() {
    await this.page.goBack()
  }

  async getTitle(): Promise<string> {
    return this.page.title()
  }
}
