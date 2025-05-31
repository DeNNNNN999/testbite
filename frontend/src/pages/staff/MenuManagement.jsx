import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus, FiToggleLeft, FiToggleRight, FiImage, FiX } from 'react-icons/fi';

const MenuManagement = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    preparationTime: '20',
    calories: '',
    weight: '',
    image: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, menuRes] = await Promise.all([
        api.get('/categories'),
        api.get('/menu')
      ]);
      setCategories(categoriesRes.data);
      setMenuItems(menuRes.data);
    } catch (error) {
      toast.error('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.categoryId === selectedCategory)
    : menuItems;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await api.put(`/menu/${editingItem.id}`, formData);
        toast.success('Блюдо обновлено');
      } else {
        await api.post('/menu', formData);
        toast.success('Блюдо добавлено');
      }
      
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Ошибка при сохранении');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await api.patch(`/menu/${item.id}/availability`);
      toast.success(`${item.name} ${!item.isAvailable ? 'доступно' : 'недоступно'}`);
      fetchData();
    } catch (error) {
      toast.error('Ошибка при изменении доступности');
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('Вы уверены, что хотите удалить это блюдо?')) {
      return;
    }
    
    try {
      await api.delete(`/menu/${itemId}`);
      toast.success('Блюдо удалено');
      fetchData();
    } catch (error) {
      toast.error('Ошибка при удалении');
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      categoryId: item.categoryId,
      preparationTime: item.preparationTime || '20',
      calories: item.calories || '',
      weight: item.weight || '',
      image: item.image || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      preparationTime: '20',
      calories: '',
      weight: '',
      image: ''
    });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление меню</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Добавить блюдо
        </button>
      </div>

      {/* Фильтр по категориям */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Все блюда ({menuItems.length})
          </button>
          {categories.map(category => {
            const count = menuItems.filter(item => item.categoryId === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Список блюд */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Блюдо
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Время
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Доступность
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50 ${!item.isAvailable ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                          <FiImage className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category?.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-medium">{item.price} ₽</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.preparationTime} мин
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`flex items-center ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {item.isAvailable ? (
                        <>
                          <FiToggleRight className="h-6 w-6" />
                          <span className="ml-1 text-sm">Доступно</span>
                        </>
                      ) : (
                        <>
                          <FiToggleLeft className="h-6 w-6" />
                          <span className="ml-1 text-sm">Недоступно</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Редактировать"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Удалить"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно добавления/редактирования */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {editingItem ? 'Редактировать блюдо' : 'Добавить блюдо'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Название</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="label">Описание</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    rows="2"
                  />
                </div>
                
                <div>
                  <label className="label">Категория</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="label">Цена (₽)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="label">Время приготовления (мин)</label>
                  <input
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                    className="input"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="label">Вес</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="input"
                    placeholder="Например: 350г"
                  />
                </div>
                
                <div>
                  <label className="label">Калории</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    className="input"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="label">URL изображения</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
