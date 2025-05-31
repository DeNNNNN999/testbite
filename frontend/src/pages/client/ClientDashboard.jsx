import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { FiShoppingBag, FiCalendar, FiGift, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeOrders: [],
    upcomingBookings: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Загружаем активные заказы
      const ordersResponse = await api.get('/orders/my?status=new,confirmed,preparing,ready');
      const activeOrders = ordersResponse.data.slice(0, 3);
      
      // Загружаем предстоящие бронирования
      const bookingsResponse = await api.get('/bookings/my?status=confirmed');
      const upcomingBookings = bookingsResponse.data
        .filter(b => new Date(b.bookingDate) >= new Date())
        .slice(0, 3);
      
      // Загружаем последние заказы
      const recentOrdersResponse = await api.get('/orders/my');
      const recentOrders = recentOrdersResponse.data.slice(0, 5);

      setStats({
        activeOrders,
        upcomingBookings,
        recentOrders
      });
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-600';
      case 'confirmed': return 'bg-green-100 text-green-600';
      case 'preparing': return 'bg-yellow-100 text-yellow-600';
      case 'ready': return 'bg-purple-100 text-purple-600';
      case 'delivered': return 'bg-gray-100 text-gray-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'confirmed': return 'Подтвержден';
      case 'preparing': return 'Готовится';
      case 'ready': return 'Готов';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      default: return status;
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Добро пожаловать, {user.firstName}!</h1>
        <p className="text-gray-600">Здесь вы можете управлять своими заказами и бронированиями</p>
      </div>

      {/* Статистика */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-600 text-sm font-medium">Бонусные баллы</p>
              <p className="text-2xl font-bold text-primary-800">{user.bonusPoints}</p>
            </div>
            <FiGift className="h-8 w-8 text-primary-400" />
          </div>
        </div>
        
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Активные заказы</p>
              <p className="text-2xl font-bold text-green-800">{stats.activeOrders.length}</p>
            </div>
            <FiShoppingBag className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Бронирования</p>
              <p className="text-2xl font-bold text-blue-800">{stats.upcomingBookings.length}</p>
            </div>
            <FiCalendar className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Активные заказы */}
      {stats.activeOrders.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Активные заказы</h2>
            <Link to="/client/orders" className="text-primary-600 hover:text-primary-700 text-sm">
              Все заказы →
            </Link>
          </div>
          
          <div className="space-y-3">
            {stats.activeOrders.map(order => (
              <div key={order.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Заказ #{order.orderNumber}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.items.length} товаров на сумму {order.totalAmount} ₽
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <FiClock className="inline mr-1" />
                      {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                  <Link 
                    to={`/client/orders/${order.id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Предстоящие бронирования */}
      {stats.upcomingBookings.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Предстоящие бронирования</h2>
            <Link to="/client/bookings" className="text-primary-600 hover:text-primary-700 text-sm">
              Все бронирования →
            </Link>
          </div>
          
          <div className="space-y-3">
            {stats.upcomingBookings.map(booking => (
              <div key={booking.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {format(new Date(booking.bookingDate), 'd MMMM yyyy', { locale: ru })} в {booking.bookingTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      Столик на {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'гостя' : 'гостей'}
                    </p>
                    {booking.tableNumber && (
                      <p className="text-sm text-gray-500">Столик №{booking.tableNumber}</p>
                    )}
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                    Подтверждено
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* История заказов */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">История заказов</h2>
          <Link to="/client/orders" className="text-primary-600 hover:text-primary-700 text-sm">
            Все заказы →
          </Link>
        </div>
        
        {stats.recentOrders.length === 0 ? (
          <p className="text-gray-500">У вас пока нет заказов</p>
        ) : (
          <div className="space-y-2">
            {stats.recentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <span className="font-medium text-sm">#{order.orderNumber}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {format(new Date(order.createdAt), 'dd.MM.yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{order.totalAmount} ₽</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
