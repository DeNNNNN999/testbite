import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiMinus, FiPlus, FiTrash2, FiClock, FiMapPin } from 'react-icons/fi';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState({
    deliveryType: 'pickup',
    deliveryAddress: '',
    deliveryTime: '',
    paymentMethod: 'cash',
    notes: '',
    bonusPointsUsed: 0
  });
  
  const [loading, setLoading] = useState(false);

  const maxBonusPoints = Math.min(user?.bonusPoints || 0, Math.floor(getTotalPrice() * 0.3));

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleSubmitOrder = async () => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Корзина пуста');
      return;
    }

    if (orderData.deliveryType === 'delivery' && !orderData.deliveryAddress) {
      toast.error('Укажите адрес доставки');
      return;
    }

    setLoading(true);
    
    try {
      const orderItems = items.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        notes: ''
      }));

      const { data } = await api.post('/orders', {
        items: orderItems,
        ...orderData
      });

      clearCart();
      toast.success('Заказ успешно оформлен!');
      navigate('/client/orders');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };

  const finalPrice = getTotalPrice() - (orderData.bonusPointsUsed / 10);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Ваша корзина пуста</p>
          <button
            onClick={() => navigate('/menu')}
            className="btn btn-primary"
          >
            Перейти к меню
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Список товаров */}
        <div className="lg:col-span-2">
          <div className="card">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.price} ₽</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">{item.price * item.quantity} ₽</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 mt-1"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Форма заказа */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Оформление заказа</h2>
            
            {/* Способ получения */}
            <div className="mb-4">
              <label className="label">Способ получения</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    checked={orderData.deliveryType === 'pickup'}
                    onChange={(e) => setOrderData({ ...orderData, deliveryType: e.target.value })}
                    className="mr-2"
                  />
                  <span>Самовывоз</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="delivery"
                    checked={orderData.deliveryType === 'delivery'}
                    onChange={(e) => setOrderData({ ...orderData, deliveryType: e.target.value })}
                    className="mr-2"
                  />
                  <span>Доставка</span>
                </label>
              </div>
            </div>
            
            {/* Адрес доставки */}
            {orderData.deliveryType === 'delivery' && (
              <div className="mb-4">
                <label className="label">
                  <FiMapPin className="inline mr-1" />
                  Адрес доставки
                </label>
                <textarea
                  value={orderData.deliveryAddress}
                  onChange={(e) => setOrderData({ ...orderData, deliveryAddress: e.target.value })}
                  className="input"
                  rows="2"
                  placeholder="Укажите адрес доставки"
                  required
                />
              </div>
            )}
            
            {/* Время доставки */}
            <div className="mb-4">
              <label className="label">
                <FiClock className="inline mr-1" />
                Желаемое время
              </label>
              <input
                type="datetime-local"
                value={orderData.deliveryTime}
                onChange={(e) => setOrderData({ ...orderData, deliveryTime: e.target.value })}
                className="input"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            
            {/* Способ оплаты */}
            <div className="mb-4">
              <label className="label">Способ оплаты</label>
              <select
                value={orderData.paymentMethod}
                onChange={(e) => setOrderData({ ...orderData, paymentMethod: e.target.value })}
                className="input"
              >
                <option value="cash">Наличными</option>
                <option value="card">Картой при получении</option>
                <option value="online">Онлайн</option>
              </select>
            </div>
            
            {/* Бонусные баллы */}
            {user && user.bonusPoints > 0 && (
              <div className="mb-4">
                <label className="label">
                  Использовать бонусные баллы
                  <span className="text-sm text-gray-500 ml-2">
                    (доступно: {user.bonusPoints})
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={maxBonusPoints}
                  value={orderData.bonusPointsUsed}
                  onChange={(e) => setOrderData({ 
                    ...orderData, 
                    bonusPointsUsed: Math.min(parseInt(e.target.value) || 0, maxBonusPoints)
                  })}
                  className="input"
                />
                <p className="text-sm text-gray-500 mt-1">
                  10 баллов = 1 ₽. Максимум 30% от суммы заказа
                </p>
              </div>
            )}
            
            {/* Комментарий */}
            <div className="mb-6">
              <label className="label">Комментарий к заказу</label>
              <textarea
                value={orderData.notes}
                onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                className="input"
                rows="2"
                placeholder="Дополнительные пожелания"
              />
            </div>
            
            {/* Итого */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Сумма заказа:</span>
                <span className="font-semibold">{getTotalPrice()} ₽</span>
              </div>
              {orderData.bonusPointsUsed > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Скидка за баллы:</span>
                  <span>-{orderData.bonusPointsUsed / 10} ₽</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold">
                <span>Итого:</span>
                <span className="text-primary-600">{finalPrice} ₽</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmitOrder}
              disabled={loading}
              className="w-full btn btn-primary mt-6"
            >
              {loading ? 'Оформление...' : 'Оформить заказ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
