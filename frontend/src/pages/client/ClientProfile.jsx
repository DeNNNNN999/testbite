import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiGift } from 'react-icons/fi';

const ClientProfile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile(formData);
    
    if (result.success) {
      setEditing(false);
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || ''
    });
    setEditing(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Мой профиль</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Информация о профиле */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Личная информация</h2>
          
          {!editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Имя</label>
                <p className="font-medium">{user.firstName} {user.lastName}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-medium">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Телефон</label>
                <p className="font-medium">{user.phone || 'Не указан'}</p>
              </div>
              
              <button
                onClick={() => setEditing(true)}
                className="btn btn-primary"
              >
                Редактировать
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <FiUser className="inline mr-1" />
                  Имя
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label className="label">
                  <FiUser className="inline mr-1" />
                  Фамилия
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label className="label">
                  <FiMail className="inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  className="input bg-gray-100"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email изменить нельзя</p>
              </div>
              
              <div>
                <label className="label">
                  <FiPhone className="inline mr-1" />
                  Телефон
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Бонусная программа */}
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Бонусная программа</h2>
            <FiGift className="h-8 w-8 text-primary-600" />
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-primary-800">{user.bonusPoints}</p>
              <p className="text-sm text-gray-600">бонусных баллов</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="font-medium">Как использовать баллы:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>10 баллов = 1 рубль скидки</li>
                <li>Можно оплатить до 30% от суммы заказа</li>
                <li>Баллы начисляются автоматически (5% от суммы)</li>
              </ul>
            </div>
            
            <div className="pt-4 border-t border-primary-200">
              <p className="text-xs text-gray-600">
                Баллы начисляются после доставки заказа и действуют в течение года
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
