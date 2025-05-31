import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiClock, FiInfo } from 'react-icons/fi';

const MenuCatalog = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      toast.error('Ошибка при загрузке категорий');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const { data } = await api.get('/menu');
      setMenuItems(data);
      setLoading(false);
    } catch (error) {
      toast.error('Ошибка при загрузке меню');
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.categoryId === selectedCategory)
    : menuItems;

  const handleAddToCart = (item) => {
    if (!item.isAvailable) {
      toast.error('Блюдо временно недоступно');
      return;
    }
    addToCart(item);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Наше меню</h1>

      {/* Фильтр по категориям */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Все блюда
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Список блюд */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="card hover:shadow-lg transition-shadow">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <span className="text-xl font-bold text-primary-600">
                {item.price} ₽
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{item.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              {item.weight && (
                <span className="flex items-center">
                  <FiInfo className="mr-1" />
                  {item.weight}
                </span>
              )}
              {item.preparationTime && (
                <span className="flex items-center">
                  <FiClock className="mr-1" />
                  {item.preparationTime} мин
                </span>
              )}
              {item.calories && (
                <span>{item.calories} ккал</span>
              )}
            </div>
            
            <button
              onClick={() => handleAddToCart(item)}
              disabled={!item.isAvailable}
              className={`w-full btn ${
                item.isAvailable
                  ? 'btn-primary'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {item.isAvailable ? (
                <>
                  <FiShoppingCart className="mr-2" />
                  В корзину
                </>
              ) : (
                'Недоступно'
              )}
            </button>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            В этой категории пока нет блюд
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuCatalog;
