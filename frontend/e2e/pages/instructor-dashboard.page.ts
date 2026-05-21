import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base.page'

export class InstructorDashboardPage extends BasePage {
  readonly pageTitle: Locator
  readonly createCourseButton: Locator
  readonly coursesTable: Locator
  readonly courseRow: Locator
  readonly editButton: Locator
  readonly deleteButton: Locator
  readonly publishButton: Locator
  readonly statsSection: Locator
  readonly totalCoursesCard: Locator
  readonly totalStudentsCard: Locator
  readonly modalTitle: Locator
  readonly modalCloseButton: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.getByText(/dashboard|mis cursos|my courses/i)
    this.createCourseButton = page.getByRole('button', { name: /crear curso|create course|nuevo curso/i })
    this.coursesTable = page.locator('table, [class*="grid"]')
    this.courseRow = page.locator('tr, [class*="card"]')
    this.editButton = page.getByRole('link', { name: /editar|edit/i })
    this.deleteButton = page.getByRole('button', { name: /eliminar|delete|borrar/i })
    this.publishButton = page.getByRole('button', { name: /publicar|publish/i })
    this.statsSection = page.locator('[class*="stats"], [class*="metric"]')
    this.totalCoursesCard = page.getByText(/cursos|courses/i)
    this.totalStudentsCard = page.getByText(/estudiantes|students|inscritos/i)
    this.modalTitle = page.locator('[role="dialog"] h1, [role="dialog"] h2')
    this.modalCloseButton = page.getByRole('button', { name: /cerrar|close|cancelar/i })
  }

  async goto() {
    await super.goto('/dashboard/instructor')
  }

  async expectPageVisible() {
    await expect(this.pageTitle).toBeVisible()
    await expect(this.page).toHaveURL(/.*\/dashboard\/instructor/)
  }

  async clickCreateCourseButton() {
    await this.click(this.createCourseButton)
    // Esperar a que se abra el modal o se navegue
    await this.page.waitForLoadState('networkidle')
  }

  async getCourseRow(courseTitle: string) {
    return this.page
      .locator('tr, [class*="card"]')
      .filter({ hasText: courseTitle })
      .first()
  }

  async clickEditCourse(courseTitle: string) {
    const row = await this.getCourseRow(courseTitle)
    const editBtn = row.getByRole('link', { name: /editar|edit/i })
    await editBtn.click()
    await this.waitForURL(/\/dashboard\/instructor\/courses\//)
  }

  async clickDeleteCourse(courseTitle: string) {
    const row = await this.getCourseRow(courseTitle)
    const deleteBtn = row.getByRole('button', { name: /eliminar|delete/i })
    await deleteBtn.click()
  }

  async expectCourseVisible(title: string) {
    const row = await this.getCourseRow(title)
    await expect(row).toBeVisible()
  }

  async expectCourseNotVisible(title: string) {
    const row = this.page.getByText(title)
    await expect(row).not.toBeVisible({ timeout: 5000 })
  }

  async expectStatsVisible() {
    await expect(this.statsSection).toBeVisible()
  }

  async expectTotalCoursesCardVisible() {
    await expect(this.totalCoursesCard).toBeVisible()
  }

  async expectTotalStudentsCardVisible() {
    await expect(this.totalStudentsCard).toBeVisible()
  }

  async expectCreateCourseModalOpen() {
    await expect(this.modalTitle).toBeVisible()
  }

  async closeModal() {
    await this.click(this.modalCloseButton)
    await this.page.waitForLoadState('networkidle')
  }

  async getCourseCount(): Promise<number> {
    const rows = await this.page.locator('tr, [class*="card"]').count()
    return rows
  }

  async expectCoursesCountGreaterThan(count: number) {
    const total = await this.getCourseCount()
    expect(total).toBeGreaterThan(count)
  }
}
