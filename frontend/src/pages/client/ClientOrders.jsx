import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiClock, FiMapPin, FiTruck, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

const ClientOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const { data } = await api.get(`/orders/my${params}`);
      setOrders(data);
    } catch (error) {
      toast.error('Ошибка при загрузке заказов');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Вы уверены, что хотите отменить заказ?')) {
      return;
    }

    try {
      await api.post(`/orders/${orderId}/cancel`);
      toast.success('Заказ отменен');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Ошибка при отмене заказа');
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

  const canCancelOrder = (status) => {
    return ['new', 'confirmed'].includes(status);
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
      <h1 className="text-2xl font-bold mb-6">Мои заказы</h1>

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
            Все заказы
          </button>
          <button
            onClick={() => setFilter('new,confirmed,preparing,ready')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'new,confirmed,preparing,ready'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Активные
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'delivered'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Выполненные
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

      {/* Список заказов */}
      {orders.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">Заказов не найдено</p>
          <Link to="/menu" className="btn btn-primary mt-4">
            Перейти к меню
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Заказ #{order.orderNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <FiClock className="mr-1" />
                      {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}
                    </span>
                    <span className="flex items-center">
                      {order.deliveryType === 'delivery' ? (
                        <>
                          <FiTruck className="mr-1" />
                          Доставка
                        </>
                      ) : (
                        <>
                          <FiMapPin className="mr-1" />
                          Самовывоз
                        </>
                      )}
                    </span>
                  </div>
                  
                  {order.deliveryAddress && (
                    <p className="text-sm text-gray-600 mt-1">
                      Адрес: {order.deliveryAddress}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {canCancelOrder(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Отменить заказ"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Состав заказа */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Состав заказа:</h4>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.menuItem.name} x {item.quantity}
                      </span>
                      <span className="font-medium">{item.totalPrice} ₽</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t mt-3 pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Итого:</span>
                    <span className="text-lg font-bold text-primary-600">{order.totalAmount} ₽</span>
                  </div>
                  {order.bonusPointsUsed > 0 && (
                    <p className="text-sm text-green-600 text-right">
                      Использовано баллов: {order.bonusPointsUsed}
                    </p>
                  )}
                </div>
              </div>

              {order.notes && (
                <div className="border-t mt-4 pt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Комментарий:</span> {order.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientOrders;
