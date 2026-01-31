import './App.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Define your routes here */}
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
      
  );
}

export default App;
