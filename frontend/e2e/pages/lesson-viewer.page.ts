import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base.page'

export class LessonViewerPage extends BasePage {
  readonly lessonTitle: Locator
  readonly lessonContent: Locator
  readonly videoPlayer: Locator
  readonly nextLessonButton: Locator
  readonly previousLessonButton: Locator
  readonly lessonList: Locator
  readonly courseTitle: Locator
  readonly backToCourseButton: Locator
  readonly backToDashboardButton: Locator

  constructor(page: Page) {
    super(page)
    this.lessonTitle = page.getByRole('heading', { level: 1 })
    this.lessonContent = page.locator('main')
    this.videoPlayer = page.locator('iframe[src*="youtube"]')
    this.nextLessonButton = page.getByRole('button', { name: /siguiente|next/i })
    this.previousLessonButton = page.getByRole('button', { name: /anterior|previous|back/i })
    this.lessonList = page.locator('aside, nav')
    this.courseTitle = page.getByText(/curso|course/i).first()
    this.backToCourseButton = page.getByRole('link', { name: /volver|back|regresar/i })
    this.backToDashboardButton = page.getByRole('link', { name: /dashboard/i })
  }

  async goToLessonByUrl(courseId: string, lessonId?: string) {
    const url = lessonId ? `/learn/${courseId}/${lessonId}` : `/learn/${courseId}`
    await super.goto(url)
  }

  async expectLessonVisible() {
    await expect(this.lessonTitle).toBeVisible()
    await expect(this.lessonContent).toBeVisible()
  }

  async expectVideoVisible() {
    await expect(this.videoPlayer).toBeVisible()
  }

  async expectLessonListVisible() {
    await expect(this.lessonList).toBeVisible()
  }

  async clickLessonFromList(lessonTitle: string) {
    const lesson = this.page.getByText(lessonTitle, { exact: false })
    await lesson.click()
    await this.waitForNavigation()
  }

  async goToNextLesson() {
    await this.click(this.nextLessonButton)
    await this.waitForNavigation()
  }

  async goToPreviousLesson() {
    await this.click(this.previousLessonButton)
    await this.waitForNavigation()
  }

  async expectNextLessonButtonVisible() {
    await expect(this.nextLessonButton).toBeVisible()
  }

  async expectPreviousLessonButtonVisible() {
    await expect(this.previousLessonButton).toBeVisible()
  }

  async expectCourseTitleVisible() {
    await expect(this.courseTitle).toBeVisible()
  }

  async backToCourse() {
    await this.click(this.backToCourseButton)
    await this.waitForNavigation()
  }

  async expectLessonContent(text: string) {
    await expect(this.lessonContent).toContainText(text)
  }

  async getLessonTitle(): Promise<string | null> {
    return await this.lessonTitle.textContent()
  }

  async expectToBeOnLearnPage() {
    await expect(this.page).toHaveURL(/.*\/learn\//)
  }
}
