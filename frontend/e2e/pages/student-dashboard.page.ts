import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base.page'

export class StudentDashboardPage extends BasePage {
  readonly enrolledCourses: Locator
  readonly pageTitle: Locator
  readonly backButton: Locator
  readonly coursesGrid: Locator
  readonly emptyState: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.getByText(/tus cursos|mis cursos|enrolled courses/i)
    this.enrolledCourses = page.locator('[data-testid="enrolled-courses"]')
    this.backButton = page.getByRole('link', { name: /atrás|back|volver/i })
    this.coursesGrid = page.locator('[class*="grid"]')
    this.emptyState = page.getByText(/no hay cursos|no courses|sin inscripciones/i)
  }

  async goto() {
    await super.goto('/dashboard/student')
  }

  async expectPageVisible() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.page).toHaveURL(/.*\/dashboard\/student/)
  }

  async getCourseByTitle(title: string) {
    return this.page
      .locator('div')
      .filter({ hasText: title })
      .first()
  }

  async clickCourse(title: string) {
    const course = await this.getCourseByTitle(title)
    await course.click()
    await this.waitForURL(/\/learn\//)
  }

  async expectEnrolledCoursesCount(count: number) {
    const courses = await this.page.locator('[class*="card"]').count()
    expect(courses).toBe(count)
  }

  async expectEnrolledCoursesCountGreaterThan(count: number) {
    const courses = await this.page.locator('[class*="card"]').count()
    expect(courses).toBeGreaterThan(count)
  }

  async expectCourseVisible(title: string) {
    const course = await this.getCourseByTitle(title)
    await expect(course).toBeVisible()
  }

  async expectCourseNotVisible(title: string) {
    const course = this.page.getByText(title)
    await expect(course).not.toBeVisible({ timeout: 5000 })
  }

  async expectEmptyState() {
    await expect(this.emptyState).toBeVisible()
  }

  async expectNotEmptyState() {
    await expect(this.emptyState).not.toBeVisible()
  }
}
