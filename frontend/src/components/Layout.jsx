import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

const Layout = () => {
  const { user, logout, isStaff, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isStaff) return '/staff';
    return '/client';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-primary-600">TasteBite</span>
              </Link>
              
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link to="/menu" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Меню
                </Link>
                {user && (
                  <Link to="/bookings" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                    Бронирование
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-600">
                    <FiShoppingCart className="h-6 w-6" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                  
                  <div className="hidden md:flex items-center space-x-4">
                    <Link to={getDashboardLink()} className="text-gray-700 hover:text-primary-600 flex items-center">
                      <FiUser className="mr-1" />
                      <span className="text-sm">{user.firstName}</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-primary-600 flex items-center"
                    >
                      <FiLogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link to="/login" className="btn btn-secondary">
                    Войти
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Регистрация
                  </Link>
                </div>
              )}
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700"
              >
                <FiMenu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/menu" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                Меню
              </Link>
              {user && (
                <>
                  <Link to="/bookings" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                    Бронирование
                  </Link>
                  <Link to={getDashboardLink()} className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                    Личный кабинет
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Выйти
                  </button>
                </>
              )}
              {!user && (
                <>
                  <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                    Войти
                  </Link>
                  <Link to="/register" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TasteBite</h3>
              <p className="text-gray-400">Современный ресторан с лучшими блюдами</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <p className="text-gray-400">Телефон: +7 (800) 123-45-67</p>
              <p className="text-gray-400">Email: info@tastebite.ru</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Часы работы</h4>
              <p className="text-gray-400">Ежедневно: 10:00 - 22:00</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
