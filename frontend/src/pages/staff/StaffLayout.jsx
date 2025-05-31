import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiHome, FiShoppingBag, FiCalendar, FiBookOpen, FiSettings } from 'react-icons/fi';

const StaffLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Главная', href: '/staff', icon: FiHome },
    { name: 'Заказы', href: '/staff/orders', icon: FiShoppingBag },
    { name: 'Бронирования', href: '/staff/bookings', icon: FiCalendar },
    { name: 'Меню', href: '/staff/menu', icon: FiBookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Боковое меню */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-primary-600 mt-2">Сотрудник</p>
            </div>
            
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Основной контент */}
        <div className="lg:col-span-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StaffLayout;
