import { Link } from 'react-router-dom';
import { FiClock, FiMapPin, FiPhone, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero секция */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Добро пожаловать в TasteBite
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Современная кухня и незабываемая атмосфера
            </p>
            <div className="space-x-4">
              <Link to="/menu" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Посмотреть меню
              </Link>
              {user && (
                <Link to="/bookings" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg">
                  Забронировать столик
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Информация о ресторане */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Часы работы</h3>
              <p className="text-gray-600">Ежедневно</p>
              <p className="text-gray-600">10:00 - 22:00</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Адрес</h3>
              <p className="text-gray-600">ул. Примерная, 123</p>
              <p className="text-gray-600">Москва, 123456</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPhone className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Контакты</h3>
              <p className="text-gray-600">+7 (800) 123-45-67</p>
              <p className="text-gray-600">info@tastebite.ru</p>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Свежие продукты</h3>
              <p className="text-gray-600">Мы используем только самые свежие и качественные ингредиенты</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Быстрая доставка</h3>
              <p className="text-gray-600">Доставим ваш заказ горячим в течение 45 минут</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Лучшие повара</h3>
              <p className="text-gray-600">Наша команда - это профессионалы с многолетним опытом</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Уютная атмосфера</h3>
              <p className="text-gray-600">Комфортная обстановка для приятного времяпрепровождения</p>
            </div>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы сделать заказ?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Выберите из нашего разнообразного меню и наслаждайтесь вкусной едой
          </p>
          <Link to="/menu" className="btn btn-primary px-8 py-3 text-lg inline-flex items-center">
            Перейти к меню
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
