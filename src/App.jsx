import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import PageNotFound from './pages/PageNotFound';

// Admin
import AdminHome from './admin/AdminHome';
import ViewAllUsers from './admin/ViewAllUsers';
import ViewAllCertificates from './admin/ViewAllCertificates';

// User
import UserHome from './user/UserHome';
import AddCertificate from './user/AddCertificate';
import ViewCertificates from './user/ViewCertificates';
import UpdateCertificate from './user/UpdateCertificate';
import UserProfile from './user/UserProfile';

function App() {
  const { theme } = useTheme();

  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin/home" element={<PrivateRoute allowedRole="admin"><AdminHome /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute allowedRole="admin"><ViewAllUsers /></PrivateRoute>} />
          <Route path="/admin/certificates" element={<PrivateRoute allowedRole="admin"><ViewAllCertificates /></PrivateRoute>} />

          {/* User Routes */}
          <Route path="/user/home" element={<PrivateRoute allowedRole="user"><UserHome /></PrivateRoute>} />
          <Route path="/user/add-certificate" element={<PrivateRoute allowedRole="user"><AddCertificate /></PrivateRoute>} />
          <Route path="/user/view-certificates" element={<PrivateRoute allowedRole="user"><ViewCertificates /></PrivateRoute>} />
          <Route path="/user/update-certificate/:certName" element={<PrivateRoute allowedRole="user"><UpdateCertificate /></PrivateRoute>} />
          <Route path="/user/profile" element={<PrivateRoute allowedRole="user"><UserProfile /></PrivateRoute>} />

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
