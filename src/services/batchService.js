import { apiClient, handleApiError } from './ApiService';

function mapBatchFromApi(batch) {
  return {
    id: String(batch.id),
    batchName: batch.batch_name,
    courseId: batch.course_id ? String(batch.course_id) : null,
    courseName: batch.course_name || '',
    instructorId: batch.instructor_id ? String(batch.instructor_id) : null,
    instructorName: batch.instructor_name || '',
    startDate: batch.start_date,
    endDate: batch.end_date || null,
    maxStudents: batch.max_students || 0,
    enrolledCount: batch.enrolled_count || 0,
    createdAt: batch.created_at,
    updatedAt: batch.updated_at,
  };
}

class BatchService {
  async getAllBatches(params = {}) {
    try {
      const { page = 1, limit = 10, course_id } = params;
      const queryParams = { page, limit };
      if (course_id) queryParams.course_id = course_id;
      const response = await apiClient.get('/batches', { params: queryParams });
      const data = response.data;
      return {
        success: true,
        data: {
          data: (data.batches || []).map(mapBatchFromApi),
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

  async getBatchById(batchId) {
    try {
      const response = await apiClient.get(`/batches/${batchId}`);
      const data = response.data;
      const batch = mapBatchFromApi(data.batch);
      batch.students = (data.students || []).map((s) => ({
        id: String(s.id),
        fullName: s.full_name,
        email: s.email,
        joinedAt: s.joined_at,
      }));
      return { success: true, data: batch };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async createBatch(batchData) {
    try {
      const payload = {
        course_id: batchData.courseId,
        instructor_id: batchData.instructorId,
        batch_name: batchData.batchName,
        start_date: batchData.startDate,
        end_date: batchData.endDate || null,
        max_students: batchData.maxStudents || 0,
      };
      const response = await apiClient.post('/batches', payload);
      const batch = mapBatchFromApi(response.data.batch);
      return { success: true, data: batch };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async updateBatch(batchId, batchData) {
    try {
      const payload = {};
      if (batchData.courseId !== undefined) payload.course_id = batchData.courseId;
      if (batchData.instructorId !== undefined) payload.instructor_id = batchData.instructorId;
      if (batchData.batchName !== undefined) payload.batch_name = batchData.batchName;
      if (batchData.startDate !== undefined) payload.start_date = batchData.startDate;
      if (batchData.endDate !== undefined) payload.end_date = batchData.endDate;
      if (batchData.maxStudents !== undefined) payload.max_students = batchData.maxStudents;
      const response = await apiClient.put(`/batches/${batchId}`, payload);
      const batch = mapBatchFromApi(response.data.batch);
      return { success: true, data: batch };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async deleteBatch(batchId) {
    try {
      await apiClient.delete(`/batches/${batchId}`);
      return { success: true, data: { success: true } };
    } catch (error) {
      return handleApiError(error);
    }
  }

  async enrollStudent(batchId, studentId) {
    try {
      const response = await apiClient.post(`/batches/${batchId}/enroll`, { student_id: studentId });
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export const batchService = new BatchService();
