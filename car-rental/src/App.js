import './App.css';
import { Routes, Route } from "react-router-dom";
import MainLayout from './pages/MainLayout';
import Home from './pages/Home';
// import { CartProvider } from './components/CartContext';
// import Cart from './pages/Cart';

function App() {
  return (
    // <CartProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element = {<Home />} />
          
        </Route>
      </Routes>
    // </CartProvider>
  );
}

export default App;
