import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomCursor from './components/ui/CustomCursor';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import RegisterForm from './pages/RegisterForm';
import LoginForm from './pages/LoginForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative font-bengali selection:bg-golden-orange selection:text-white">
        <CustomCursor />
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path='/register' element={<RegisterForm />} />
            <Route path='/login' element={<LoginForm />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
