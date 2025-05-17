import './App.css';
import { Routes, Route } from "react-router-dom";
import MainLayout from './pages/MainLayout';
import Home from './pages/Home';
import CarDetail from './pages/CarDetail';
import AdvancedSearch from './components/AdvancedSearch';
import AvailableCars from './pages/AvailableCars';
// import { CartProvider } from './components/CartContext';
// import Cart from './pages/Cart';

function App() {
  return (
    // <CartProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element = {<Home />} />
          <Route path="/car/:name" element={<CarDetail />} />
          <Route path="/advancedSearch" element={<AdvancedSearch />} />
          <Route path="/availableCars" element={<AvailableCars />} />
        </Route>
      </Routes>
    // </CartProvider>
  );
}

export default App;
