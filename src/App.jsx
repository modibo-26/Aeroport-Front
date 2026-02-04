import './App.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Vols from './pages/Vols';
import VolDetails from './pages/VolDetails';
import VolReservations from './pages/VolReservations';
import AdminVols from './pages/AdminVols';
import UserNotifications from './pages/UserNotifications';
import UserReservations from './pages/UserReservations';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import { SnackbarProvider } from './context/SnackbarContext';

function App() {

  return (
    <AuthProvider>
      <SnackbarProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Vols />}  />
            <Route path="/vols/:id" element={<VolDetails />} />
            {/* Protected */}
            <Route path="/user/reservations" element={<ProtectedRoute><UserReservations /></ProtectedRoute>} />
            <Route path="/user/notifications" element={<ProtectedRoute><UserNotifications /></ProtectedRoute>} />
            {/* Admin */}
            <Route path="/admin/vols" element={<AdminRoute><AdminVols /></AdminRoute>} />
            <Route path="/admin/vols/:id/reservations" element={<AdminRoute><VolReservations /></AdminRoute>} />
            {/* Autre/404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </AuthProvider>
      
  );
}

export default App;
