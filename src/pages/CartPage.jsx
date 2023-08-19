import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/footer/Footer';
import { useNavigate } from 'react-router-dom'; // React Router v6
import './style.css';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null); // Kullanıcı bilgisini saklamak için state
  const navigate = useNavigate();
  const cartItemCount = JSON.parse(localStorage.getItem('cart'))?.length || 0;


  useEffect(() => {
    const cartItemsFromLocalStorage = localStorage.getItem('cart');
    if (cartItemsFromLocalStorage) {
      setCartItems(JSON.parse(cartItemsFromLocalStorage));
    }

    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      setUser(JSON.parse(userFromLocalStorage));
    }
  }, []);

  const handleRemoveItem = (productId) => {
    const updatedCartItems = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const handlePayment = () => {
    const totalPrice = calculateTotalPrice(cartItems);
    const paymentInfo = {
      cartItems: cartItems,
      totalPrice: totalPrice
    };

    localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));

    if (user) {
      navigate('/payment');
    } else {
      navigate('/login');
    }
  };
  function calculateTotalPrice(cartItems) {
    let totalPrice = 0;
    for (const item of cartItems) {
      totalPrice += item.price;
    }
    return totalPrice;
  }


  return (
    <div>
      <Navbar cartItemCount={cartItemCount} />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="p-3 rounded cart">
              <div className="product-details">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-md-3">
                  <a href='/productlist' className="btn btn-secondary btn-lg mb-3 mb-md-0">
                    Alışverişe devam et
                  </a>
                  <div className="text-center">
                    <strong>Toplam Fiyat:</strong> {calculateTotalPrice(cartItems)} TL
                  </div>
                  <button className="btn btn-primary btn-lg" onClick={handlePayment}>
                    Ödemeye Geç
                  </button>
                </div>
                <hr />
                <h2 className="mb-0">Sepetiniz</h2>
                <div className="mt-3">
                  {cartItems.length === 0 ? (
                    <div className="d-flex justify-content-center align-items-center">
                      <p className="text-center">Cart is empty</p>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.productId} className="d-flex align-items-center mb-3">
                        <img
                          style={{
                            border: '1px solid #F8F8F8',
                            borderRadius: '5px',
                            boxShadow: '1px 2px 4px grey',
                          }}
                          src={`data:image/png;base64,${item.image}`}
                          alt="Ürün Resmi"
                          width="70px"
                          height="70px"
                        />
                        <div className="ml-3">
                          <div>{item.brand}</div>
                          <div>{item.productName}</div>
                        </div>
                        <div className="ml-auto d-flex align-items-center">
                          <span className="d-block">Beden: {item.size}</span>
                          <span className="d-block ml-3 font-weight-bold">{item.price} TL</span>
                          <button
                            type="button"
                            className="shop-tooltip close float-none text-danger"
                            style={{ paddingLeft: '20px' }}
                            title="Remove"
                            onClick={() => handleRemoveItem(item.productId)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;
