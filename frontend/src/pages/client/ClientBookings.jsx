import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiUsers, FiMapPin } from 'react-icons/fi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const ClientBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } catch (error) {
      toast.error('Ошибка при загрузке бронирований');
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
      fetchBookings();
    } catch (error) {
      toast.error('Ошибка при отмене бронирования');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'confirmed': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      case 'completed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
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

  const getHallName = (hall) => {
    switch (hall) {
      case 'main': return 'Основной зал';
      case 'vip': return 'VIP зал';
      case 'terrace': return 'Терраса';
      default: return hall;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'upcoming':
        return bookingDate >= today && booking.status !== 'cancelled';
      case 'past':
        return bookingDate < today || booking.status === 'completed';
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Мои бронирования</h1>

      {/* Фильтры */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Предстоящие
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'past'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Прошедшие
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'cancelled'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Отмененные
          </button>
        </div>
      </div>

      {/* Список бронирований */}
      {filteredBookings.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">Бронирований не найдено</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    {format(new Date(booking.bookingDate), 'd MMMM yyyy', { locale: ru })}
                  </h3>
                  <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
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

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-2" />
                  <span>Время: {booking.bookingTime}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FiUsers className="mr-2" />
                  <span>Количество гостей: {booking.numberOfGuests}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-2" />
                  <span>{getHallName(booking.hall)}</span>
                  {booking.tableNumber && (
                    <span className="ml-2">• Столик №{booking.tableNumber}</span>
                  )}
                </div>
                
                {booking.specialRequests && (
                  <div className="pt-2 border-t">
                    <p className="text-gray-600">
                      <span className="font-medium">Пожелания:</span> {booking.specialRequests}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientBookings;
