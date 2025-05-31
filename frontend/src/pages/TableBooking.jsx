import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiUsers, FiPhone } from 'react-icons/fi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const TableBooking = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    bookingDate: '',
    bookingTime: '',
    numberOfGuests: 2,
    specialRequests: '',
    contactPhone: user?.phone || '',
    hall: 'main'
  });
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('new'); // new или my

  useEffect(() => {
    if (activeTab === 'my') {
      fetchMyBookings();
    }
  }, [activeTab]);

  const fetchMyBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setMyBookings(data);
    } catch (error) {
      toast.error('Ошибка при загрузке бронирований');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bookingDate || !formData.bookingTime) {
      toast.error('Выберите дату и время');
      return;
    }

    if (!formData.contactPhone) {
      toast.error('Укажите контактный телефон');
      return;
    }

    setLoading(true);
    
    try {
      await api.post('/bookings', formData);
      toast.success('Столик успешно забронирован!');
      
      // Сброс формы
      setFormData({
        ...formData,
        bookingDate: '',
        bookingTime: '',
        specialRequests: ''
      });
      
      // Переключение на вкладку с бронированиями
      setActiveTab('my');
      fetchMyBookings();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Ошибка при бронировании');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите отменить бронирование?')) {
      return;
    }

    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      toast.success('Бронирование отменено');
      fetchMyBookings();
    } catch (error) {
      toast.error('Ошибка при отмене бронирования');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Ожидает подтверждения';
      case 'confirmed': return 'Подтверждено';
      case 'cancelled': return 'Отменено';
      case 'completed': return 'Завершено';
      default: return status;
    }
  };

  // Генерация временных слотов
  const timeSlots = [];
  for (let hour = 10; hour < 22; hour++) {
    timeSlots.push(`${hour}:00`, `${hour}:30`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Бронирование столика</h1>

      {/* Вкладки */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('new')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'new'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Новое бронирование
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'my'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Мои бронирования
        </button>
      </div>

      {activeTab === 'new' ? (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Дата */}
              <div>
                <label className="label">
                  <FiCalendar className="inline mr-1" />
                  Дата
                </label>
                <input
                  type="date"
                  value={formData.bookingDate}
                  onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="input"
                  required
                />
              </div>

              {/* Время */}
              <div>
                <label className="label">
                  <FiClock className="inline mr-1" />
                  Время
                </label>
                <select
                  value={formData.bookingTime}
                  onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Выберите время</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              {/* Количество гостей */}
              <div>
                <label className="label">
                  <FiUsers className="inline mr-1" />
                  Количество гостей
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                  className="input"
                  required
                />
              </div>

              {/* Телефон */}
              <div>
                <label className="label">
                  <FiPhone className="inline mr-1" />
                  Контактный телефон
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="input"
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>

              {/* Зал */}
              <div>
                <label className="label">Зал</label>
                <select
                  value={formData.hall}
                  onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                  className="input"
                >
                  <option value="main">Основной зал</option>
                  <option value="vip">VIP зал</option>
                  <option value="terrace">Терраса</option>
                </select>
              </div>
            </div>

            {/* Особые пожелания */}
            <div>
              <label className="label">Особые пожелания</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="input"
                rows="3"
                placeholder="Например: столик у окна, детское кресло, день рождения..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary"
            >
              {loading ? 'Бронирование...' : 'Забронировать столик'}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500">У вас пока нет бронирований</p>
            </div>
          ) : (
            myBookings.map(booking => (
              <div key={booking.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {format(new Date(booking.bookingDate), 'd MMMM yyyy', { locale: ru })}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-gray-600">
                      <p>
                        <FiClock className="inline mr-1" />
                        Время: {booking.bookingTime}
                      </p>
                      <p>
                        <FiUsers className="inline mr-1" />
                        Гостей: {booking.numberOfGuests}
                      </p>
                      <p>Зал: {booking.hall === 'main' ? 'Основной' : booking.hall === 'vip' ? 'VIP' : 'Терраса'}</p>
                      {booking.tableNumber && (
                        <p>Столик №{booking.tableNumber}</p>
                      )}
                      {booking.specialRequests && (
                        <p className="italic">Пожелания: {booking.specialRequests}</p>
                      )}
                    </div>
                  </div>
                  
                  {['pending', 'confirmed'].includes(booking.status) && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Отменить
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TableBooking;
