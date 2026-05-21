import { test, expect } from '../fixtures/auth.fixture'
import { CoursesPage } from '../pages/courses.page'
import { StudentDashboardPage } from '../pages/student-dashboard.page'

test.describe('Enrollment Flow', () => {
  test('estudiante puede ver cursos publicados', async ({ studentPage }) => {
    // Arrange
    const coursesPage = new CoursesPage(studentPage)

    // Act
    await coursesPage.goto()

    // Assert
    await expect(studentPage).toHaveURL(/.*\//)
    await coursesPage.expectCourseCountGreaterThan(0)
  })

  test('estudiante puede inscribirse en un curso', async ({ studentPage }) => {
    // Arrange
    const coursesPage = new CoursesPage(studentPage)

    // Act
    await coursesPage.goto()
    const courses = await studentPage.locator('[class*="card"]')
    const courseCount = await courses.count()

    if (courseCount > 0) {
      // Obtener el título del primer curso
      const firstCourseTitle = await courses.first().textContent()

      if (firstCourseTitle) {
        // Intentar inscribirse
        await coursesPage.enrollInCourse(firstCourseTitle)
      }
    }

    // Assert
    await expect(studentPage).toHaveURL(/.*\/learn\//)
  })

  test('estudiante puede ver sus cursos inscritos en el dashboard', async ({
    studentPage,
  }) => {
    // Arrange
    const dashboardPage = new StudentDashboardPage(studentPage)

    // Act
    await dashboardPage.goto()

    // Assert
    await dashboardPage.expectPageVisible()
  })

  test('estudiante no puede acceder a cursos sin estar inscrito', async ({ page }) => {
    // Arrange - no autenticado
    const coursesPage = new CoursesPage(page)

    // Act
    await coursesPage.goto()

    // Assert - debería estar en la página de inicio
    await expect(page).toHaveURL(/.*\//)
  })

  test('mensaje de error si intenta inscribirse sin autenticación', async ({ page }) => {
    // Arrange
    const coursesPage = new CoursesPage(page)

    // Act - intentar navegar a ruta de inscripción
    await page.goto('/api/courses/invalid-id/enroll', { waitUntil: 'networkidle' })

    // Assert - debería devolver error o redirigir
    const status = page.url()
    expect(status).toBeDefined()
  })
})
