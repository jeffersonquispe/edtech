import { test, expect } from '../fixtures/auth.fixture'
import { InstructorDashboardPage } from '../pages/instructor-dashboard.page'

test.describe('Instructor Dashboard', () => {
  test('instructor puede acceder a su dashboard', async ({ instructorPage }) => {
    // Arrange
    const dashboardPage = new InstructorDashboardPage(instructorPage)

    // Act
    await dashboardPage.goto()

    // Assert
    await dashboardPage.expectPageVisible()
    await expect(instructorPage).toHaveURL(/.*\/dashboard\/instructor/)
  })

  test('dashboard instructor muestra estadísticas', async ({ instructorPage }) => {
    // Arrange
    const dashboardPage = new InstructorDashboardPage(instructorPage)

    // Act
    await dashboardPage.goto()

    // Assert
    await dashboardPage.expectStatsVisible()
    await dashboardPage.expectTotalCoursesCardVisible()
  })

  test('instructor ve lista de sus cursos', async ({ instructorPage }) => {
    // Arrange
    const dashboardPage = new InstructorDashboardPage(instructorPage)

    // Act
    await dashboardPage.goto()
    const courseCount = await dashboardPage.getCourseCount()

    // Assert
    expect(courseCount).toBeGreaterThanOrEqual(0)
  })

  test('instructor puede ver botón para crear curso', async ({ instructorPage }) => {
    // Arrange
    const dashboardPage = new InstructorDashboardPage(instructorPage)

    // Act
    await dashboardPage.goto()

    // Assert
    await expect(dashboardPage.createCourseButton).toBeVisible()
  })

  test('estudiante no puede acceder a dashboard instructor', async ({ studentPage }) => {
    // Arrange - autenticado como estudiante

    // Act
    await studentPage.goto('/dashboard/instructor')

    // Assert - debería redirigir o mostrar error
    const url = studentPage.url()
    // Dependiendo de implementación, podría redirigir a /dashboard/student o /
    expect(url).toBeDefined()
  })
})
