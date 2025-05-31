import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiDownload, FiCalendar, FiTrendingUp, FiUsers, FiDollarSign, FiClock } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [activeTab, setActiveTab] = useState('sales');
  
  const [salesData, setSalesData] = useState({
    daily: [],
    summary: {},
    deliveryStats: []
  });
  
  const [productsData, setProductsData] = useState({
    popular: [],
    categories: []
  });
  
  const [customersData, setCustomersData] = useState({
    topCustomers: [],
    newCustomers: 0,
    totalCustomers: 0
  });
  
  const [timeData, setTimeData] = useState({
    hourly: [],
    weekday: []
  });

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSalesData(),
        fetchProductsData(),
        fetchCustomersData(),
        fetchTimeData()
      ]);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesData = async () => {
    const { data } = await api.get(`/stats/sales?startDate=${dateRange.start}&endDate=${dateRange.end}`);
    setSalesData(data);
  };

  const fetchProductsData = async () => {
    const [popularRes, categoriesRes] = await Promise.all([
      api.get(`/stats/popular-items?limit=10&startDate=${dateRange.start}&endDate=${dateRange.end}`),
      api.get(`/stats/categories?startDate=${dateRange.start}&endDate=${dateRange.end}`)
    ]);
    setProductsData({
      popular: popularRes.data,
      categories: categoriesRes.data
    });
  };

  const fetchCustomersData = async () => {
    const { data } = await api.get(`/stats/customers?startDate=${dateRange.start}&endDate=${dateRange.end}`);
    setCustomersData(data);
  };

  const fetchTimeData = async () => {
    const { data } = await api.get(`/stats/order-times?startDate=${dateRange.start}&endDate=${dateRange.end}`);
    setTimeData(data);
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const handleQuickDateRange = (days) => {
    const end = new Date();
    const start = subDays(end, days);
    setDateRange({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd')
    });
  };

  const exportData = () => {
    // В реальном приложении здесь был бы экспорт в Excel/PDF
    toast.info('Функция экспорта будет доступна в следующей версии');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(value);
  };

  const COLORS = ['#e86100', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];

  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Аналитика и отчеты</h1>
        <button
          onClick={exportData}
          className="btn btn-primary flex items-center"
        >
          <FiDownload className="mr-2" />
          Экспорт отчета
        </button>
      </div>

      {/* Выбор периода */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className="input w-40"
            />
            <span>—</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className="input w-40"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickDateRange(7)}
              className="btn btn-secondary btn-sm"
            >
              7 дней
            </button>
            <button
              onClick={() => handleQuickDateRange(30)}
              className="btn btn-secondary btn-sm"
            >
              30 дней
            </button>
            <button
              onClick={() => handleQuickDateRange(90)}
              className="btn btn-secondary btn-sm"
            >
              90 дней
            </button>
          </div>
        </div>
      </div>

      {/* Сводка */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Общая выручка</p>
              <p className="text-2xl font-bold">{formatCurrency(salesData.summary.totalRevenue || 0)}</p>
            </div>
            <FiDollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Заказов</p>
              <p className="text-2xl font-bold">{salesData.summary.totalOrders || 0}</p>
            </div>
            <FiTrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Средний чек</p>
              <p className="text-2xl font-bold">{formatCurrency(salesData.summary.averageOrderValue || 0)}</p>
            </div>
            <FiDollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Новых клиентов</p>
              <p className="text-2xl font-bold">{customersData.newCustomers}</p>
            </div>
            <FiUsers className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'sales', name: 'Продажи', icon: FiDollarSign },
            { id: 'products', name: 'Товары', icon: FiTrendingUp },
            { id: 'customers', name: 'Клиенты', icon: FiUsers },
            { id: 'time', name: 'Время', icon: FiClock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Контент вкладок */}
      <div className="space-y-6">
        {activeTab === 'sales' && (
          <>
            {/* График продаж по дням */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Динамика продаж</h2>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={salesData.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'dd.MM')}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(date) => format(new Date(date), 'dd MMMM yyyy', { locale: ru })}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#e86100" 
                    fill="#e86100"
                    fillOpacity={0.6}
                    name="Выручка"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Статистика по типам доставки */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Способы получения</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesData.deliveryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ deliveryType, percent }) => `${deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {salesData.deliveryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Выручка по способам получения</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData.deliveryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="deliveryType" 
                      tickFormatter={(type) => type === 'delivery' ? 'Доставка' : 'Самовывоз'}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#e86100" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <>
            {/* Топ товаров */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Топ-10 популярных блюд</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={productsData.popular} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="menuItem.name" 
                    type="category" 
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => [`${value} шт.`, 'Продано']} />
                  <Bar dataKey="totalQuantity" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Продажи по категориям */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Выручка по категориям</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productsData.categories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalRevenue"
                    >
                      {productsData.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Количество заказов по категориям</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productsData.categories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orderCount" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'customers' && (
          <>
            {/* Топ клиентов */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Топ клиентов по сумме заказов</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Клиент
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Заказов
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Сумма
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Бонусы
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customersData.topCustomers.map((customer, index) => (
                      <tr key={customer.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-white ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="ml-3 font-medium">
                              {customer.firstName} {customer.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="font-medium">{customer.orderCount}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="font-bold text-primary-600">
                            {formatCurrency(customer.totalSpent)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                            {customer.bonusPoints}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'time' && (
          <>
            {/* Заказы по часам */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Распределение заказов по часам</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeData.hourlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(hour) => `${hour}:00 - ${hour}:59`}
                    formatter={(value, name) => [
                      name === 'orders' ? `${value} заказов` : formatCurrency(value),
                      name === 'orders' ? 'Заказы' : 'Выручка'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#0ea5e9" name="Заказы" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Заказы по дням недели */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Распределение заказов по дням недели</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeData.weekdayStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="dayOfWeek" 
                    tickFormatter={(day) => weekDays[day]}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    labelFormatter={(day) => weekDays[day]}
                    formatter={(value, name) => [
                      name === 'orders' ? `${value} заказов` : formatCurrency(value),
                      name === 'orders' ? 'Заказы' : 'Выручка'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="orders" fill="#10b981" name="Заказы" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#f59e0b" name="Выручка" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsAnalytics;
