import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Страницы
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuCatalog from './pages/MenuCatalog';
import Cart from './pages/Cart';
import TableBooking from './pages/TableBooking';

// Клиентские страницы
import ClientLayout from './pages/client/ClientLayout';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientOrders from './pages/client/ClientOrders';
import ClientBookings from './pages/client/ClientBookings';
import ClientProfile from './pages/client/ClientProfile';

// Страницы сотрудников
import StaffLayout from './pages/staff/StaffLayout';
import StaffDashboard from './pages/staff/StaffDashboard';
import OrdersManagement from './pages/staff/OrdersManagement';
import MenuManagement from './pages/staff/MenuManagement';
import BookingsManagement from './pages/staff/BookingsManagement';

// Страницы администратора
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffManagement from './pages/admin/StaffManagement';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import SettingsPromo from './pages/admin/SettingsPromo';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#f87171',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Публичные страницы */}
              <Route index element={<HomePage />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="menu" element={<MenuCatalog />} />
              <Route path="cart" element={<Cart />} />
              
              {/* Приватные страницы */}
              <Route
                path="bookings"
                element={
                  <PrivateRoute>
                    <TableBooking />
                  </PrivateRoute>
                }
              />
              
              {/* Клиентские страницы */}
              <Route
                path="client"
                element={
                  <PrivateRoute roles={['client']}>
                    <ClientLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<ClientDashboard />} />
                <Route path="orders" element={<ClientOrders />} />
                <Route path="bookings" element={<ClientBookings />} />
                <Route path="profile" element={<ClientProfile />} />
              </Route>
              
              {/* Страницы сотрудников */}
              <Route
                path="staff"
                element={
                  <PrivateRoute roles={['staff', 'admin']}>
                    <StaffLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<StaffDashboard />} />
                <Route path="orders" element={<OrdersManagement />} />
                <Route path="menu" element={<MenuManagement />} />
                <Route path="bookings" element={<BookingsManagement />} />
              </Route>
              
              {/* Страницы администратора */}
              <Route
                path="admin"
                element={
                  <PrivateRoute roles={['admin']}>
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<OrdersManagement />} />
                <Route path="menu" element={<MenuManagement />} />
                <Route path="bookings" element={<BookingsManagement />} />
                <Route path="users" element={<StaffManagement />} />
                <Route path="analytics" element={<ReportsAnalytics />} />
                <Route path="settings" element={<SettingsPromo />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
