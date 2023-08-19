import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProductListPage from '../src/pages/ProductListPage';
import ProductDetailPage from '../src/pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import HomePage from './pages/Homepage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import PaymentPage from './pages/PaymentPages';

function App() {
  return (
    <div>
      <Routes>
        <Route exact path='/' element={<HomePage/>} />
        <Route  path="/productlist" element={<ProductListPage/>} />
        <Route path="/products/:productId" element={<ProductDetailPage/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path='/admin' element={<AdminPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/payment' element={<PaymentPage/>} />
      </Routes>
      </div>
  );
}

export default App;