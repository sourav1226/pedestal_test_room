import { apiClient, handleApiError } from './ApiService';

function mapCourseFromApi(course) {
  return {
    id: String(course.id),
    courseName: course.course_name,
    description: course.description || '',
    durationDays: course.duration_days || 0,
    status: course.status || 'active',
    createdAt: course.created_at,
  };
}

class CourseService {
  async getAllCourses(params = {}) {
    try {
      const { page = 1, limit = 1000, status } = params;
      const queryParams = { page, limit };
      if (status) queryParams.status = status;
      const response = await apiClient.get('/courses', { params: queryParams });
      const data = response.data;
      return {
        success: true,
        data: {
          data: (data.courses || []).map(mapCourseFromApi),
          total: data.pagination?.total || 0,
          page: data.pagination?.page || 1,
          limit: data.pagination?.limit || 10,
          totalPages: Math.ceil((data.pagination?.total || 0) / (data.pagination?.limit || 10)),
        },
      };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async getCourseById(courseId) {
    try {
      const response = await apiClient.get(`/courses/${courseId}`);
      const course = mapCourseFromApi(response.data.course);
      return { success: true, data: course };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async createCourse(courseData) {
    try {
      const payload = {
        course_name: courseData.courseName,
        description: courseData.description || null,
        duration_days: courseData.durationDays || 0,
      };
      const response = await apiClient.post('/courses', payload);
      const course = mapCourseFromApi(response.data.course);
      return { success: true, data: course };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      const payload = {};
      if (courseData.courseName !== undefined) payload.course_name = courseData.courseName;
      if (courseData.description !== undefined) payload.description = courseData.description;
      if (courseData.durationDays !== undefined) payload.duration_days = courseData.durationDays;
      if (courseData.status !== undefined) payload.status = courseData.status;
      const response = await apiClient.put(`/courses/${courseId}`, payload);
      const course = mapCourseFromApi(response.data.course);
      return { success: true, data: course };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async deleteCourse(courseId) {
    try {
      await apiClient.delete(`/courses/${courseId}`);
      return { success: true, data: { success: true } };
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export const courseService = new CourseService();
