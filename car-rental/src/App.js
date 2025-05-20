import './App.css';
import { Routes, Route } from "react-router-dom";
import MainLayout from './pages/MainLayout';
import Home from './pages/Home';
import CarDetail from './pages/CarDetail';
import AdvancedSearch from './components/AdvancedSearch';
import AvailableCars from './pages/AvailableCars';
import Booking from './pages/Booking';
import Order from './pages/Order';

function App() {
  return (
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element = {<Home />} />
          <Route path="/car/:name" element={<CarDetail />} />
          <Route path="/advancedSearch" element={<AdvancedSearch />} />
          <Route path="/availableCars" element={<AvailableCars />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/order" element={<Order />} />
        </Route>
      </Routes>
  );
}

export default App;
