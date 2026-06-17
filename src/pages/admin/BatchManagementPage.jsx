import { useState } from 'react';
import { useBatches, useCreateBatch, useUpdateBatch, useDeleteBatch, useCourses, useUsers } from '@hooks/index';
import { Card, Button, Modal, Alert, EmptyState, Pagination, Table, Input, Select, Badge } from '@components/common';

function BatchForm({ initialData, onSubmit, onCancel, courses, instructors, loading }) {
  const [formData, setFormData] = useState(initialData || {
    batchName: '',
    courseId: '',
    instructorId: '',
    startDate: '',
    endDate: '',
    maxStudents: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Batch Name"
        value={formData.batchName}
        onChange={(e) => handleChange('batchName', e.target.value)}
        required
      />
      <Select
        label="Course"
        value={formData.courseId}
        onChange={(e) => handleChange('courseId', e.target.value)}
        options={[
          { value: '', label: 'Select course' },
          ...(courses || []).map((c) => ({ value: c.id, label: c.courseName })),
        ]}
        required
      />
      <Select
        label="Instructor"
        value={formData.instructorId}
        onChange={(e) => handleChange('instructorId', e.target.value)}
        options={[
          { value: '', label: 'Select instructor' },
          ...(instructors || []).map((u) => ({ value: u.id, label: u.fullName })),
        ]}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate ? formData.startDate.substring(0, 10) : ''}
          onChange={(e) => handleChange('startDate', e.target.value)}
          required
        />
        <Input
          label="End Date"
          type="date"
          value={formData.endDate ? formData.endDate.substring(0, 10) : ''}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </div>
      <Input
        label="Max Students"
        type="number"
        value={formData.maxStudents}
        onChange={(e) => handleChange('maxStudents', e.target.value)}
        min="0"
      />
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" loading={loading}>
          {initialData?.id ? 'Update Batch' : 'Create Batch'}
        </Button>
      </div>
    </form>
  );
}

export const BatchManagementPage = () => {
  const [page, setPage] = useState(1);
  const { data: batches, total, loading, refetch } = useBatches({ page, limit: 10 });
  const { data: courses } = useCourses({ limit: 1000 });
  const { data: users } = useUsers({ limit: 1000 });
  const { create: createBatch, loading: createLoading } = useCreateBatch();
  const { update: updateBatch, loading: updateLoading } = useUpdateBatch();
  const { delete: deleteBatch, loading: deleteLoading } = useDeleteBatch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [error, setError] = useState(null);

  const instructors = (users || []).filter((u) => u.roleId === 2 || u.roleId === 1);

  const handleCreate = async (batchData) => {
    try {
      setError(null);
      await createBatch(batchData);
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      setError(err.message || 'Failed to create batch');
    }
  };

  const handleUpdate = async (batchData) => {
    if (!editingBatch?.id) return;
    try {
      setError(null);
      await updateBatch(editingBatch.id, batchData);
      setEditingBatch(null);
      refetch();
    } catch (err) {
      setError(err.message || 'Failed to update batch');
    }
  };

  const handleDelete = async (batchId) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      try {
        setError(null);
        await deleteBatch(batchId);
        refetch();
      } catch (err) {
        setError(err.message || 'Failed to delete batch');
      }
    }
  };

  const totalPages = Math.ceil(total / 10);

  const columns = [
    { key: 'batchName', header: 'Batch Name', render: (value) => <span className="font-medium">{value}</span> },
    { key: 'courseName', header: 'Course' },
    { key: 'instructorName', header: 'Instructor' },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      key: 'endDate',
      header: 'End Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      key: 'enrolledCount',
      header: 'Enrolled',
      render: (value, row) => (
        <Badge variant={value >= row.maxStudents && row.maxStudents > 0 ? 'danger' : 'primary'}>
          {value}{row.maxStudents > 0 ? ` / ${row.maxStudents}` : ''}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setEditingBatch(row)} disabled={createLoading || updateLoading || deleteLoading}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)} disabled={createLoading || updateLoading || deleteLoading}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Batch Management</h1>
          <p className="text-gray-600 mt-2">Create and manage student batches</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>+ New Batch</Button>
      </div>

      {error && <Alert type="error" title="Error" onClose={() => setError(null)}>{error}</Alert>}

      {batches.length === 0 ? (
        <EmptyState
          title="No Batches Yet"
          description="Create your first batch to get started"
          action={<Button onClick={() => setShowCreateModal(true)}>Create Batch</Button>}
        />
      ) : (
        <Card>
          <Table columns={columns} data={batches} loading={loading} />
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </Card>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Batch" size="lg">
        <BatchForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          courses={courses}
          instructors={instructors}
          loading={createLoading}
        />
      </Modal>

      <Modal isOpen={!!editingBatch} onClose={() => setEditingBatch(null)} title="Edit Batch" size="lg">
        {editingBatch && (
          <BatchForm
            initialData={editingBatch}
            onSubmit={handleUpdate}
            onCancel={() => setEditingBatch(null)}
            courses={courses}
            instructors={instructors}
            loading={updateLoading}
          />
        )}
      </Modal>
    </div>
  );
};
