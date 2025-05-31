import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiUsers, FiMapPin, FiCheck, FiX, FiPhone } from 'react-icons/fi';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('list'); // list или calendar
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, filter]);

  const fetchBookings = async () => {
    try {
      let params = '';
      if (viewMode === 'calendar') {
        params = `?date=${format(selectedDate, 'yyyy-MM-dd')}`;
      } else if (filter !== 'all') {
        params = `?status=${filter}`;
      }
      
      const { data } = await api.get(`/bookings${params}`);
      setBookings(data);
    } catch (error) {
      toast.error('Ошибка при загрузке бронирований');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status, tableNumber = null) => {
    try {
      const data = { status };
      if (tableNumber) data.tableNumber = tableNumber;
      
      await api.patch(`/bookings/${bookingId}/status`, data);
      toast.success('Статус бронирования обновлен');
      fetchBookings();
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const confirmBooking = (booking) => {
    const tableNumber = prompt('Введите номер столика:');
    if (tableNumber) {
      updateBookingStatus(booking.id, 'confirmed', tableNumber);
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
      case 'pending': return 'Ожидает';
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

  // Календарь
  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getBookingsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.filter(booking => booking.bookingDate === dateStr);
  };

  const renderCalendar = () => {
    const days = getDaysInMonth();
    const firstDayOfWeek = getDay(startOfMonth(currentMonth));
    const emptyDays = Array(firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1).fill(null);

    return (
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="btn btn-secondary btn-sm"
            >
              ← Пред
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="btn btn-secondary btn-sm"
            >
              Сегодня
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="btn btn-secondary btn-sm"
            >
              След →
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-700 py-2">
              {day}
            </div>
          ))}
          
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="p-2"></div>
          ))}
          
          {days.map(day => {
            const dayBookings = getBookingsForDate(day);
            const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <div
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                  isSelected ? 'bg-primary-100 border-primary-500' : ''
                } ${isToday ? 'font-bold' : ''}`}
              >
                <div className="text-sm">{format(day, 'd')}</div>
                {dayBookings.length > 0 && (
                  <div className="text-xs mt-1">
                    <span className="bg-primary-600 text-white px-1 rounded">
                      {dayBookings.length}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
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
        <h1 className="text-2xl font-bold">Управление бронированиями</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Список
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Календарь
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
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
                Все бронирования
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'pending'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Ожидают подтверждения
              </button>
              <button
                onClick={() => setFilter('confirmed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'confirmed'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Подтвержденные
              </button>
            </div>
          </div>

          {/* Список бронирований */}
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {format(new Date(booking.bookingDate), 'd MMMM yyyy', { locale: ru })}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Информация о госте</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <FiUsers className="inline mr-2" />
                            {booking.user.firstName} {booking.user.lastName}
                          </p>
                          <p>
                            <FiPhone className="inline mr-2" />
                            {booking.contactPhone}
                          </p>
                          <p>Гостей: {booking.numberOfGuests}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Детали бронирования</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <FiClock className="inline mr-2" />
                            Время: {booking.bookingTime}
                          </p>
                          <p>
                            <FiMapPin className="inline mr-2" />
                            {getHallName(booking.hall)}
                          </p>
                          {booking.tableNumber && (
                            <p>Столик №{booking.tableNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {booking.specialRequests && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm">
                          <span className="font-medium">Пожелания:</span> {booking.specialRequests}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => confirmBooking(booking)}
                          className="btn btn-primary btn-sm flex items-center"
                        >
                          <FiCheck className="mr-1" />
                          Подтвердить
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="btn btn-danger btn-sm flex items-center"
                        >
                          <FiX className="mr-1" />
                          Отменить
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="btn btn-secondary btn-sm"
                      >
                        Завершить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {bookings.length === 0 && (
            <div className="card text-center py-8">
              <p className="text-gray-500">Бронирований не найдено</p>
            </div>
          )}
        </>
      ) : (
        <>
          {renderCalendar()}
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">
              Бронирования на {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
            </h2>
            <div className="space-y-3">
              {bookings.map(booking => (
                <div key={booking.id} className="card">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{booking.bookingTime}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {booking.user.firstName} {booking.user.lastName} • {booking.numberOfGuests} гостей • {getHallName(booking.hall)}
                        {booking.tableNumber && ` • Столик №${booking.tableNumber}`}
                      </p>
                    </div>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => confirmBooking(booking)}
                        className="btn btn-primary btn-sm"
                      >
                        Подтвердить
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {bookings.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  На эту дату нет бронирований
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsManagement;
