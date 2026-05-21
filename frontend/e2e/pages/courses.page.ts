import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base.page'

export class CoursesPage extends BasePage {
  readonly courseGrid: Locator
  readonly enrollButton: Locator
  readonly logoutButton: Locator
  readonly navbarUserMenu: Locator
  readonly categoryFilter: Locator
  readonly pageTitle: Locator

  constructor(page: Page) {
    super(page)
    this.courseGrid = page.locator('[class*="grid"]')
    this.enrollButton = page.getByRole('button', { name: /inscribirse|enroll/i })
    this.logoutButton = page.getByRole('button', { name: /salir|logout|exit/i })
    this.navbarUserMenu = page.getByRole('button', { name: /usuario|profile|menu/i })
    this.categoryFilter = page.locator('select[name="category"]')
    this.pageTitle = page.getByText(/cursos|courses|catálogo/i)
  }

  async goto() {
    await super.goto('/')
  }

  async searchCourseByTitle(title: string) {
    return this.page.getByText(title, { exact: false }).first()
  }

  async getCourseCard(title: string) {
    return this.page
      .locator('div')
      .filter({ hasText: title })
      .first()
  }

  async enrollInCourse(courseTitle: string) {
    const courseCard = await this.searchCourseByTitle(courseTitle)
    await courseCard.click()
    await this.waitForNavigation()

    // Hacer clic en botón de inscripción
    const enrollBtn = this.page.getByRole('button', { name: /inscribirse|enroll/i })
    await enrollBtn.click()

    // Esperar a que se complete la inscripción (redirige a /learn/:id)
    await this.waitForURL(/\/learn\//)
  }

  async expectCourseVisible(title: string) {
    const course = await this.searchCourseByTitle(title)
    await expect(course).toBeVisible()
  }

  async expectCourseNotVisible(title: string) {
    const course = this.page.getByText(title)
    await expect(course).not.toBeVisible({ timeout: 5000 })
  }

  async expectEnrollButtonDisabled() {
    await expect(this.enrollButton).toBeDisabled()
  }

  async expectEnrollButtonEnabled() {
    await expect(this.enrollButton).toBeEnabled()
  }

  async clickCourse(title: string) {
    const courseCard = await this.searchCourseByTitle(title)
    await courseCard.click()
    await this.waitForNavigation()
  }

  async filterByCategoryId(categoryId: string) {
    await this.selectOption(this.categoryFilter, categoryId)
    await this.waitForNavigation()
  }

  async expectCourseCountGreaterThan(count: number) {
    const courses = await this.page.locator('[class*="card"]').count()
    expect(courses).toBeGreaterThan(count)
  }

  async logout() {
    await this.click(this.logoutButton)
    await this.waitForURL(/\/login/)
  }

  async expectCoursesPageVisible() {
    await expect(this.page).toHaveURL(/.*\//)
  }

  async getCoursePriceByTitle(title: string) {
    const courseCard = await this.getCourseCard(title)
    const priceText = await courseCard
      .getByText(/\$|€|£/)
      .textContent()
    return priceText
  }

  async getInstructorNameByTitle(title: string) {
    const courseCard = await this.getCourseCard(title)
    const instructorText = await courseCard.getByText(/instructor|por/i).textContent()
    return instructorText
  }
}
