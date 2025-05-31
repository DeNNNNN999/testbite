import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FiShoppingBag, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const StaffDashboard = () => {
  const [stats, setStats] = useState({
    newOrders: 0,
    preparingOrders: 0,
    todayOrders: 0,
    todayBookings: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Обновляем данные каждые 30 секунд
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Загружаем заказы
      const ordersResponse = await api.get('/orders');
      const orders = ordersResponse.data;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const newOrders = orders.filter(o => o.status === 'new').length;
      const preparingOrders = orders.filter(o => o.status === 'preparing').length;
      const todayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      }).length;
      
      const recentOrders = orders
        .filter(o => ['new', 'confirmed', 'preparing'].includes(o.status))
        .slice(0, 5);
      
      // Загружаем бронирования на сегодня
      const todayStr = format(today, 'yyyy-MM-dd');
      const bookingsResponse = await api.get(`/bookings?date=${todayStr}`);
      const todayBookings = bookingsResponse.data.length;

      setStats({
        newOrders,
        preparingOrders,
        todayOrders,
        todayBookings,
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
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'confirmed': return 'Подтвержден';
      case 'preparing': return 'Готовится';
      case 'ready': return 'Готов';
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
        <h1 className="text-2xl font-bold mb-2">Панель сотрудника</h1>
        <p className="text-gray-600">Управление заказами и бронированиями</p>
      </div>

      {/* Статистика */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Новые заказы</p>
              <p className="text-2xl font-bold text-blue-800">{stats.newOrders}</p>
            </div>
            <FiAlertCircle className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Готовятся</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.preparingOrders}</p>
            </div>
            <FiClock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Заказов сегодня</p>
              <p className="text-2xl font-bold text-green-800">{stats.todayOrders}</p>
            </div>
            <FiShoppingBag className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="card bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Броней сегодня</p>
              <p className="text-2xl font-bold text-purple-800">{stats.todayBookings}</p>
            </div>
            <FiCheckCircle className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/staff/orders" className="card hover:shadow-lg transition-shadow text-center">
          <FiShoppingBag className="h-12 w-12 text-primary-600 mx-auto mb-2" />
          <h3 className="font-semibold">Управление заказами</h3>
          <p className="text-sm text-gray-600">Просмотр и обработка заказов</p>
        </Link>
        
        <Link to="/staff/bookings" className="card hover:shadow-lg transition-shadow text-center">
          <FiCalendar className="h-12 w-12 text-primary-600 mx-auto mb-2" />
          <h3 className="font-semibold">Бронирования</h3>
          <p className="text-sm text-gray-600">Управление бронированиями столиков</p>
        </Link>
        
        <Link to="/staff/menu" className="card hover:shadow-lg transition-shadow text-center">
          <FiCheckCircle className="h-12 w-12 text-primary-600 mx-auto mb-2" />
          <h3 className="font-semibold">Управление меню</h3>
          <p className="text-sm text-gray-600">Доступность блюд и цены</p>
        </Link>
      </div>

      {/* Активные заказы */}
      {stats.recentOrders.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Активные заказы</h2>
            <Link to="/staff/orders" className="text-primary-600 hover:text-primary-700 text-sm">
              Все заказы →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">№ Заказа</th>
                  <th className="text-left py-2">Клиент</th>
                  <th className="text-left py-2">Время</th>
                  <th className="text-left py-2">Сумма</th>
                  <th className="text-left py-2">Статус</th>
                  <th className="text-left py-2"></th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="py-2 font-medium">#{order.orderNumber}</td>
                    <td className="py-2">{order.user.firstName} {order.user.lastName}</td>
                    <td className="py-2 text-sm text-gray-600">
                      {format(new Date(order.createdAt), 'HH:mm')}
                    </td>
                    <td className="py-2">{order.totalAmount} ₽</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="py-2">
                      <Link 
                        to={`/staff/orders/${order.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Подробнее
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
