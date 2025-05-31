import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiShield, FiEdit, FiToggleLeft, FiToggleRight, FiPlus, FiGift } from 'react-icons/fi';

const StaffManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add' или 'bonus'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'staff'
  });
  const [bonusPoints, setBonusPoints] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const params = filter !== 'all' ? `?role=${filter}` : '';
      const { data } = await api.get(`/users${params}`);
      setUsers(data);
    } catch (error) {
      toast.error('Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    try {
      await api.post('/auth/register', formData);
      toast.success('Пользователь добавлен');
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Ошибка при добавлении пользователя');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      toast.success('Роль обновлена');
      fetchUsers();
    } catch (error) {
      toast.error('Ошибка при обновлении роли');
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await api.patch(`/users/${userId}/status`);
      toast.success('Статус обновлен');
      fetchUsers();
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const addBonusPoints = async () => {
    if (!selectedUser || bonusPoints <= 0) return;
    
    try {
      await api.post(`/users/${selectedUser.id}/bonus-points`, { points: Number(bonusPoints) });
      toast.success(`Добавлено ${bonusPoints} бонусных баллов`);
      setShowModal(false);
      setBonusPoints(0);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error('Ошибка при добавлении баллов');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'staff'
    });
  };

  const openAddModal = () => {
    setModalType('add');
    resetForm();
    setShowModal(true);
  };

  const openBonusModal = (user) => {
    setModalType('bonus');
    setSelectedUser(user);
    setBonusPoints(0);
    setShowModal(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-600';
      case 'staff': return 'bg-blue-100 text-blue-600';
      case 'client': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'staff': return 'Сотрудник';
      case 'client': return 'Клиент';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
        <button
          onClick={openAddModal}
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Добавить сотрудника
        </button>
      </div>

      {/* Фильтры */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Все пользователи ({users.length})
          </button>
          <button
            onClick={() => setFilter('admin')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'admin'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Администраторы
          </button>
          <button
            onClick={() => setFilter('staff')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'staff'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Сотрудники
          </button>
          <button
            onClick={() => setFilter('client')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'client'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Клиенты
          </button>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Контакты
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Бонусы
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-900">
                        <FiMail className="mr-1 h-4 w-4" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-gray-500">
                          <FiPhone className="mr-1 h-4 w-4" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiGift className="mr-1 h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{user.bonusPoints || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`flex items-center ${user.isActive ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {user.isActive ? (
                        <>
                          <FiToggleRight className="h-6 w-6" />
                          <span className="ml-1 text-sm">Активен</span>
                        </>
                      ) : (
                        <>
                          <FiToggleLeft className="h-6 w-6" />
                          <span className="ml-1 text-sm">Неактивен</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="client">Клиент</option>
                        <option value="staff">Сотрудник</option>
                        <option value="admin">Администратор</option>
                      </select>
                      
                      {user.role === 'client' && (
                        <button
                          onClick={() => openBonusModal(user)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Добавить бонусы"
                        >
                          <FiGift className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {modalType === 'add' ? 'Добавить сотрудника' : 'Добавить бонусные баллы'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {modalType === 'add' ? (
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                
                <div>
                  <label className="label">Пароль</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Имя</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="label">Фамилия</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="label">Телефон</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                
                <div>
                  <label className="label">Роль</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input"
                  >
                    <option value="staff">Сотрудник</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Добавить
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p>
                  Добавить бонусные баллы для {selectedUser?.firstName} {selectedUser?.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  Текущий баланс: {selectedUser?.bonusPoints || 0} баллов
                </p>
                
                <div>
                  <label className="label">Количество баллов</label>
                  <input
                    type="number"
                    value={bonusPoints}
                    onChange={(e) => setBonusPoints(e.target.value)}
                    className="input"
                    min="1"
                    placeholder="100"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={addBonusPoints}
                    className="btn btn-primary"
                    disabled={!bonusPoints || bonusPoints <= 0}
                  >
                    Добавить
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
