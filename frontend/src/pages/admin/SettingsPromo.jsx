import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiClock, FiMapPin, FiPhone, FiMail, FiPercent, FiGift, FiDollarSign, FiSettings } from 'react-icons/fi';

const SettingsPromo = () => {
  const [activeTab, setActiveTab] = useState('restaurant');
  
  // Настройки ресторана
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: 'TasteBite',
    address: 'ул. Примерная, 123, Москва',
    phone: '+7 (800) 123-45-67',
    email: 'info@tastebite.ru',
    workingHours: {
      weekdays: { open: '10:00', close: '22:00' },
      weekends: { open: '10:00', close: '23:00' }
    },
    deliveryRadius: 5,
    minOrderAmount: 500,
    deliveryFee: 200,
    freeDeliveryAmount: 1500
  });

  // Настройки промо и скидок
  const [promos, setPromos] = useState([
    {
      id: 1,
      name: 'Скидка на первый заказ',
      type: 'percentage',
      value: 10,
      minAmount: 1000,
      active: true,
      description: 'Скидка 10% на первый заказ от 1000 рублей'
    },
    {
      id: 2,
      name: 'Бесплатная доставка',
      type: 'freeDelivery',
      value: 0,
      minAmount: 1500,
      active: true,
      description: 'Бесплатная доставка при заказе от 1500 рублей'
    }
  ]);

  // Настройки лояльности
  const [loyaltySettings, setLoyaltySettings] = useState({
    enabled: true,
    earnRate: 5, // процент от суммы заказа
    redeemRate: 10, // 10 баллов = 1 рубль
    maxRedeemPercent: 30, // максимум 30% от суммы заказа
    pointsExpiry: 365, // дней
    welcomeBonus: 100
  });

  // Настройки оплаты
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'cash', name: 'Наличными', enabled: true },
    { id: 'card', name: 'Картой при получении', enabled: true },
    { id: 'online', name: 'Онлайн оплата', enabled: true }
  ]);

  const handleRestaurantSave = () => {
    // В реальном приложении здесь был бы API запрос
    toast.success('Настройки ресторана сохранены');
  };

  const handlePromoSave = () => {
    toast.success('Промо-акции обновлены');
  };

  const handleLoyaltySave = () => {
    toast.success('Настройки лояльности сохранены');
  };

  const handlePaymentSave = () => {
    toast.success('Способы оплаты обновлены');
  };

  const addPromo = () => {
    const newPromo = {
      id: Date.now(),
      name: '',
      type: 'percentage',
      value: 0,
      minAmount: 0,
      active: false,
      description: ''
    };
    setPromos([...promos, newPromo]);
  };

  const updatePromo = (id, field, value) => {
    setPromos(promos.map(promo => 
      promo.id === id ? { ...promo, [field]: value } : promo
    ));
  };

  const deletePromo = (id) => {
    if (window.confirm('Удалить эту акцию?')) {
      setPromos(promos.filter(promo => promo.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Настройки и промо-акции</h1>

      {/* Вкладки */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('restaurant')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'restaurant'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ресторан
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'promo'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Акции и скидки
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'loyalty'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Программа лояльности
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payment'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Способы оплаты
          </button>
        </nav>
      </div>

      {/* Контент вкладок */}
      {activeTab === 'restaurant' && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Основная информация</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                <FiSettings className="inline mr-1" />
                Название ресторана
              </label>
              <input
                type="text"
                value={restaurantSettings.name}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, name: e.target.value })}
                className="input"
              />
            </div>
            
            <div>
              <label className="label">
                <FiPhone className="inline mr-1" />
                Телефон
              </label>
              <input
                type="tel"
                value={restaurantSettings.phone}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, phone: e.target.value })}
                className="input"
              />
            </div>
            
            <div>
              <label className="label">
                <FiMail className="inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={restaurantSettings.email}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, email: e.target.value })}
                className="input"
              />
            </div>
            
            <div>
              <label className="label">
                <FiMapPin className="inline mr-1" />
                Адрес
              </label>
              <input
                type="text"
                value={restaurantSettings.address}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, address: e.target.value })}
                className="input"
              />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-4">Время работы</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                <FiClock className="inline mr-1" />
                Будние дни
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={restaurantSettings.workingHours.weekdays.open}
                  onChange={(e) => setRestaurantSettings({
                    ...restaurantSettings,
                    workingHours: {
                      ...restaurantSettings.workingHours,
                      weekdays: { ...restaurantSettings.workingHours.weekdays, open: e.target.value }
                    }
                  })}
                  className="input"
                />
                <span className="self-center">—</span>
                <input
                  type="time"
                  value={restaurantSettings.workingHours.weekdays.close}
                  onChange={(e) => setRestaurantSettings({
                    ...restaurantSettings,
                    workingHours: {
                      ...restaurantSettings.workingHours,
                      weekdays: { ...restaurantSettings.workingHours.weekdays, close: e.target.value }
                    }
                  })}
                  className="input"
                />
              </div>
            </div>
            
            <div>
              <label className="label">
                <FiClock className="inline mr-1" />
                Выходные
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={restaurantSettings.workingHours.weekends.open}
                  onChange={(e) => setRestaurantSettings({
                    ...restaurantSettings,
                    workingHours: {
                      ...restaurantSettings.workingHours,
                      weekends: { ...restaurantSettings.workingHours.weekends, open: e.target.value }
                    }
                  })}
                  className="input"
                />
                <span className="self-center">—</span>
                <input
                  type="time"
                  value={restaurantSettings.workingHours.weekends.close}
                  onChange={(e) => setRestaurantSettings({
                    ...restaurantSettings,
                    workingHours: {
                      ...restaurantSettings.workingHours,
                      weekends: { ...restaurantSettings.workingHours.weekends, close: e.target.value }
                    }
                  })}
                  className="input"
                />
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-4">Доставка</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">Радиус доставки (км)</label>
              <input
                type="number"
                value={restaurantSettings.deliveryRadius}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, deliveryRadius: Number(e.target.value) })}
                className="input"
                min="1"
              />
            </div>
            
            <div>
              <label className="label">Минимальная сумма заказа (₽)</label>
              <input
                type="number"
                value={restaurantSettings.minOrderAmount}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, minOrderAmount: Number(e.target.value) })}
                className="input"
                min="0"
              />
            </div>
            
            <div>
              <label className="label">Стоимость доставки (₽)</label>
              <input
                type="number"
                value={restaurantSettings.deliveryFee}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, deliveryFee: Number(e.target.value) })}
                className="input"
                min="0"
              />
            </div>
            
            <div>
              <label className="label">Бесплатная доставка от (₽)</label>
              <input
                type="number"
                value={restaurantSettings.freeDeliveryAmount}
                onChange={(e) => setRestaurantSettings({ ...restaurantSettings, freeDeliveryAmount: Number(e.target.value) })}
                className="input"
                min="0"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button onClick={handleRestaurantSave} className="btn btn-primary">
              Сохранить настройки
            </button>
          </div>
        </div>
      )}

      {activeTab === 'promo' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Активные акции</h2>
            <button onClick={addPromo} className="btn btn-primary btn-sm">
              Добавить акцию
            </button>
          </div>
          
          {promos.map(promo => (
            <div key={promo.id} className="card">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Название акции</label>
                  <input
                    type="text"
                    value={promo.name}
                    onChange={(e) => updatePromo(promo.id, 'name', e.target.value)}
                    className="input"
                    placeholder="Например: Скидка выходного дня"
                  />
                </div>
                
                <div>
                  <label className="label">Тип скидки</label>
                  <select
                    value={promo.type}
                    onChange={(e) => updatePromo(promo.id, 'type', e.target.value)}
                    className="input"
                  >
                    <option value="percentage">Процент</option>
                    <option value="fixed">Фиксированная сумма</option>
                    <option value="freeDelivery">Бесплатная доставка</option>
                  </select>
                </div>
                
                {promo.type !== 'freeDelivery' && (
                  <div>
                    <label className="label">
                      Размер скидки {promo.type === 'percentage' ? '(%)' : '(₽)'}
                    </label>
                    <input
                      type="number"
                      value={promo.value}
                      onChange={(e) => updatePromo(promo.id, 'value', Number(e.target.value))}
                      className="input"
                      min="0"
                    />
                  </div>
                )}
                
                <div>
                  <label className="label">Минимальная сумма заказа (₽)</label>
                  <input
                    type="number"
                    value={promo.minAmount}
                    onChange={(e) => updatePromo(promo.id, 'minAmount', Number(e.target.value))}
                    className="input"
                    min="0"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="label">Описание</label>
                  <textarea
                    value={promo.description}
                    onChange={(e) => updatePromo(promo.id, 'description', e.target.value)}
                    className="input"
                    rows="2"
                    placeholder="Опишите условия акции"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={promo.active}
                    onChange={(e) => updatePromo(promo.id, 'active', e.target.checked)}
                    className="mr-2"
                  />
                  <span className={promo.active ? 'text-green-600' : 'text-gray-500'}>
                    {promo.active ? 'Активна' : 'Неактивна'}
                  </span>
                </label>
                
                <button
                  onClick={() => deletePromo(promo.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
          
          <button onClick={handlePromoSave} className="btn btn-primary">
            Сохранить изменения
          </button>
        </div>
      )}

      {activeTab === 'loyalty' && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Настройки программы лояльности</h2>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={loyaltySettings.enabled}
                onChange={(e) => setLoyaltySettings({ ...loyaltySettings, enabled: e.target.checked })}
                className="mr-2"
              />
              <span>Программа лояльности активна</span>
            </label>
          </div>
          
          {loyaltySettings.enabled && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <FiPercent className="inline mr-1" />
                  Процент начисления баллов
                </label>
                <input
                  type="number"
                  value={loyaltySettings.earnRate}
                  onChange={(e) => setLoyaltySettings({ ...loyaltySettings, earnRate: Number(e.target.value) })}
                  className="input"
                  min="0"
                  max="100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {loyaltySettings.earnRate}% от суммы заказа
                </p>
              </div>
              
              <div>
                <label className="label">
                  <FiDollarSign className="inline mr-1" />
                  Курс списания баллов
                </label>
                <input
                  type="number"
                  value={loyaltySettings.redeemRate}
                  onChange={(e) => setLoyaltySettings({ ...loyaltySettings, redeemRate: Number(e.target.value) })}
                  className="input"
                  min="1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {loyaltySettings.redeemRate} баллов = 1 рубль
                </p>
              </div>
              
              <div>
                <label className="label">Максимум баллов к оплате (%)</label>
                <input
                  type="number"
                  value={loyaltySettings.maxRedeemPercent}
                  onChange={(e) => setLoyaltySettings({ ...loyaltySettings, maxRedeemPercent: Number(e.target.value) })}
                  className="input"
                  min="0"
                  max="100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  До {loyaltySettings.maxRedeemPercent}% от суммы заказа
                </p>
              </div>
              
              <div>
                <label className="label">Срок действия баллов (дней)</label>
                <input
                  type="number"
                  value={loyaltySettings.pointsExpiry}
                  onChange={(e) => setLoyaltySettings({ ...loyaltySettings, pointsExpiry: Number(e.target.value) })}
                  className="input"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  0 = бессрочно
                </p>
              </div>
              
              <div>
                <label className="label">
                  <FiGift className="inline mr-1" />
                  Приветственный бонус
                </label>
                <input
                  type="number"
                  value={loyaltySettings.welcomeBonus}
                  onChange={(e) => setLoyaltySettings({ ...loyaltySettings, welcomeBonus: Number(e.target.value) })}
                  className="input"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Баллы при регистрации
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <button onClick={handleLoyaltySave} className="btn btn-primary">
              Сохранить настройки
            </button>
          </div>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Способы оплаты</h2>
          
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <label key={method.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={method.enabled}
                  onChange={(e) => setPaymentMethods(paymentMethods.map(m => 
                    m.id === method.id ? { ...m, enabled: e.target.checked } : m
                  ))}
                  className="mr-3"
                />
                <span className={method.enabled ? '' : 'text-gray-500'}>
                  {method.name}
                </span>
              </label>
            ))}
          </div>
          
          <div className="mt-6">
            <button onClick={handlePaymentSave} className="btn btn-primary">
              Сохранить настройки
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPromo;
