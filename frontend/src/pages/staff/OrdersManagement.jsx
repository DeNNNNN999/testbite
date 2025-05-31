import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiClock, FiUser, FiMapPin, FiCheck, FiX, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Обновляем каждые 30 секунд
    return () => clearInterval(interval);
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const { data } = await api.get(`/orders${params}`);
      setOrders(data);
    } catch (error) {
      toast.error('Ошибка при загрузке заказов');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Статус заказа обновлен');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Ошибка при обновлении статуса');
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setSelectedOrder(data);
      setShowDetails(true);
    } catch (error) {
      toast.error('Ошибка при загрузке деталей заказа');
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

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'new': return 'confirmed';
      case 'confirmed': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'delivered';
      default: return null;
    }
  };

  const filters = [
    { value: 'all', label: 'Все заказы' },
    { value: 'new', label: 'Новые' },
    { value: 'confirmed', label: 'Подтвержденные' },
    { value: 'preparing', label: 'Готовятся' },
    { value: 'ready', label: 'Готовы' },
    { value: 'delivered', label: 'Доставлены' },
    { value: 'cancelled', label: 'Отменены' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Управление заказами</h1>

      {/* Фильтры */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Таблица заказов */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  № Заказа
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Время
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
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
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-medium">#{order.orderNumber}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.user.firstName} {order.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{order.user.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'dd.MM HH:mm')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm">
                      {order.deliveryType === 'delivery' ? '🚚 Доставка' : '🏪 Самовывоз'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-medium">{order.totalAmount} ₽</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewOrderDetails(order.id)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Подробности"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      
                      {getNextStatus(order.status) && (
                        <button
                          onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                          className="text-green-600 hover:text-green-900"
                          title="Следующий статус"
                        >
                          <FiCheck className="h-5 w-5" />
                        </button>
                      )}
                      
                      {['new', 'confirmed'].includes(order.status) && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                          title="Отменить"
                        >
                          <FiX className="h-5 w-5" />
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

      {/* Модальное окно с деталями заказа */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Заказ #{selectedOrder.orderNumber}</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Клиент</p>
                  <p className="font-medium">
                    {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                  </p>
                  <p className="text-sm">{selectedOrder.user.email}</p>
                  <p className="text-sm">{selectedOrder.user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Информация о доставке</p>
                  <p className="font-medium">
                    {selectedOrder.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}
                  </p>
                  {selectedOrder.deliveryAddress && (
                    <p className="text-sm">{selectedOrder.deliveryAddress}</p>
                  )}
                  {selectedOrder.deliveryTime && (
                    <p className="text-sm">
                      Желаемое время: {format(new Date(selectedOrder.deliveryTime), 'dd.MM.yyyy HH:mm')}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Состав заказа:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                      <div>
                        <span className="font-medium">{item.menuItem.name}</span>
                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                      </div>
                      <span>{item.totalPrice} ₽</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 font-bold">
                    <span>Итого:</span>
                    <span className="text-primary-600">{selectedOrder.totalAmount} ₽</span>
                  </div>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-gray-600">Комментарий:</p>
                  <p className="bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                {getNextStatus(selectedOrder.status) && (
                  <button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status));
                      setShowDetails(false);
                    }}
                    className="btn btn-primary"
                  >
                    {getNextStatus(selectedOrder.status) === 'delivered' ? 'Завершить' : 'Следующий статус'}
                  </button>
                )}
                <button
                  onClick={() => setShowDetails(false)}
                  className="btn btn-secondary"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Заказов не найдено</p>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
