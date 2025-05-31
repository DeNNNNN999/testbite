import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp, FiCalendar, FiAward } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    newCustomers: 0,
    averageOrderValue: 0,
    dailyStats: [],
    popularItems: [],
    categoryStats: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30); // последние 30 дней

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      const startDate = format(subDays(new Date(), dateRange), 'yyyy-MM-dd');
      const endDate = format(new Date(), 'yyyy-MM-dd');

      const [salesRes, popularRes, categoriesRes, customersRes] = await Promise.all([
        api.get(`/stats/sales?startDate=${startDate}&endDate=${endDate}`),
        api.get(`/stats/popular-items?limit=5&startDate=${startDate}&endDate=${endDate}`),
        api.get(`/stats/categories?startDate=${startDate}&endDate=${endDate}`),
        api.get(`/stats/customers?startDate=${startDate}&endDate=${endDate}`)
      ]);

      setStats({
        totalRevenue: salesRes.data.summary.totalRevenue || 0,
        totalOrders: salesRes.data.summary.totalOrders || 0,
        averageOrderValue: salesRes.data.summary.averageOrderValue || 0,
        newCustomers: customersRes.data.newCustomers || 0,
        dailyStats: salesRes.data.dailyStats || [],
        popularItems: popularRes.data || [],
        categoryStats: categoriesRes.data || []
      });
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#e86100', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(value);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Панель администратора</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(Number(e.target.value))}
          className="input w-48"
        >
          <option value={7}>Последние 7 дней</option>
          <option value={30}>Последние 30 дней</option>
          <option value={90}>Последние 90 дней</option>
          <option value={365}>Последний год</option>
        </select>
      </div>

      {/* Основные показатели */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Выручка</p>
              <p className="text-2xl font-bold text-green-800">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <FiDollarSign className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Заказов</p>
              <p className="text-2xl font-bold text-blue-800">{stats.totalOrders}</p>
            </div>
            <FiShoppingBag className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Средний чек</p>
              <p className="text-2xl font-bold text-purple-800">
                {formatCurrency(stats.averageOrderValue)}
              </p>
            </div>
            <FiTrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Новых клиентов</p>
              <p className="text-2xl font-bold text-orange-800">{stats.newCustomers}</p>
            </div>
            <FiUsers className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* График продаж */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Динамика продаж</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'dd.MM')}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(date) => format(new Date(date), 'dd.MM.yyyy')}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#e86100" 
                name="Выручка"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#0ea5e9" 
                name="Заказы"
                yAxisId="right"
                strokeWidth={2}
              />
              <YAxis yAxisId="right" orientation="right" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Популярные категории */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Продажи по категориям</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoryStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="totalRevenue"
              >
                {stats.categoryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Популярные блюда и быстрые действия */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Популярные блюда */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Топ-5 популярных блюд</h2>
            <Link to="/admin/analytics" className="text-primary-600 hover:text-primary-700 text-sm">
              Подробнее →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.popularItems.map((item, index) => (
              <div key={item.menuItemId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{item.menuItem?.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.totalQuantity} порций • {formatCurrency(item.totalRevenue)}
                    </p>
                  </div>
                </div>
                <FiAward className={`h-5 w-5 ${
                  index === 0 ? 'text-yellow-500' : 'text-gray-400'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/orders" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <FiShoppingBag className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Управление заказами</p>
            </Link>
            <Link to="/admin/menu" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <FiBookOpen className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Редактировать меню</p>
            </Link>
            <Link to="/admin/users" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <FiUsers className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Пользователи</p>
            </Link>
            <Link to="/admin/settings" className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <FiSettings className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Настройки</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
