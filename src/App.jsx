import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CustomCursor from './components/ui/CustomCursor';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import RegisterForm from './pages/RegisterForm';
import LoginForm from './pages/LoginForm';
import AdminRoute from './secureRoutes/AdminRoute';
import AdminDashboard from './components/dashboard/AdminDashboard';
import AddProduct from './pages/AddProduct';
import CategoryPage from './pages/CategoryPage';
import AdminPayments from './pages/admin/AdminPayments';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative font-bengali selection:bg-golden-orange selection:text-white">
        <Toaster position="top-center" reverseOrder={false} />
        <CustomCursor />
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path='/register' element={<RegisterForm />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/category/:slug' element={<CategoryPage />} />
            <Route path='/dashboard' element={<Navigate to="/admin" replace />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/add-product"
              element={
                <AdminRoute>
                  <AddProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <AdminRoute>
                  <AdminPayments />
                </AdminRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
