import { useState } from 'react';
import { useUsers, useUpdateUser, useDeleteUser } from '@hooks/index';
import { Card, Button, Modal, Alert, EmptyState, Pagination, Table, Input, Select, Badge } from '@components/common';

export const UserManagementPage = () => {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { data: users, total, loading, refetch } = useUsers({ page, limit: 10, role: roleFilter || undefined, status: statusFilter || undefined });
  const { update: updateUser, loading: updateLoading } = useUpdateUser();
  const { delete: deleteUser } = useDeleteUser();
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdate = async (userData) => {
    if (!editingUser?.id) return;
    try {
      setError(null);
      await updateUser(editingUser.id, userData);
      setEditingUser(null);
      refetch();
    } catch (err) {
      setError(err.message || 'Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        setError(null);
        await deleteUser(userId);
        refetch();
      } catch (err) {
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  const totalPages = Math.ceil(total / 10);

  const columns = [
    { key: 'fullName', header: 'Name', render: (value) => <span className="font-medium">{value}</span> },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone', render: (value) => value || '-' },
    {
      key: 'roleName',
      header: 'Role',
      render: (value) => <Badge variant="primary" size="sm">{value}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'danger'} size="sm">{value}</Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      key: 'id',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setEditingUser(row)} disabled={updateLoading}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)} disabled={updateLoading}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage system users and their roles</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-48">
          <Select
            label="Role"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'All Roles' },
              { value: '1', label: 'Admin' },
              { value: '2', label: 'Instructor' },
              { value: '3', label: 'Student' },
              { value: '4', label: 'Moderator' },
            ]}
          />
        </div>
        <div className="w-48">
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </div>
      </div>

      {error && <Alert type="error" title="Error" onClose={() => setError(null)}>{error}</Alert>}

      {users.length === 0 ? (
        <EmptyState
          title="No Users Found"
          description="Try adjusting your filters"
        />
      ) : (
        <Card>
          <Table columns={columns} data={users} loading={loading} />
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </Card>
      )}

      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Edit User">
        {editingUser && (
          <UserEditForm user={editingUser} onSave={handleUpdate} onCancel={() => setEditingUser(null)} loading={updateLoading} />
        )}
      </Modal>
    </div>
  );
};

function UserEditForm({ user, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    phone: user.phone || '',
    status: user.status || 'active',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => handleChange('fullName', e.target.value)}
        required
      />
      <Input
        label="Phone"
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
      />
      <Select
        label="Status"
        value={formData.status}
        onChange={(e) => handleChange('status', e.target.value)}
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
      />
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" loading={loading}>Save Changes</Button>
      </div>
    </form>
  );
}
