import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/footer/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const cartItemCount = JSON.parse(localStorage.getItem('cart'))?.length || 0;


    useEffect(() => {
        const paymentInfoFromLocalStorage = localStorage.getItem('paymentInfo');
        if (paymentInfoFromLocalStorage) {
            setPaymentInfo(JSON.parse(paymentInfoFromLocalStorage));
        }
    
        const userFromLocalStorage = localStorage.getItem('user');
        const parsedUser = JSON.parse(userFromLocalStorage);
    
        if (parsedUser && parsedUser.placeholder) {
            setUserInfo(null); // Clear placeholder user
        } else if (parsedUser) {
            setUserInfo(parsedUser);
        }
    
    }, []);

    if (!paymentInfo) {
        return <div>Ödeme bilgileri yükleniyor...</div>;
    }

    if (!userInfo) {
        return <div>Kişi bilgileri yükleniyor...</div>;
    }

    const handleCompletePurchase = async () => {
        try {
            for (const item of paymentInfo.cartItems) {
                const response = await axios.put(`/products/${item.productId}/decrement-stock`, { size: item.size });
                if (response.status !== 200) {
                    console.error(`Failed to decrement stock for product with ID ${item.productId}`);
                }
            }
            localStorage.removeItem('paymentInfo');
            localStorage.removeItem('cart');
            navigate('/');
        } catch (error) {
            console.error('An error occurred while decrementing stock:', error);
        }
        alert("Siparişiniz alındı.")
        localStorage.removeItem('paymentInfo');
        localStorage.removeItem('cart');
        navigate('/');
    };
    return (
        <div>
            <Navbar cartItemCount={cartItemCount} />
            <section className="gradient-custom">
                <div className="container my-5 py-5">
                    <div className="row d-flex  flex-md-row justify-content-center py-5">
                        <div className="col-md-7 ">
                            <div className="card mb-4" style={{ borderRadius: '15px' }}>
                                <div className="card-body">
                                    <div>
                                        <div>
                                            <h3>Sepetteki Ürünler</h3>
                                            <ul>
                                                {paymentInfo.cartItems.map((item) => (
                                                    <li key={item.productId}>{item.productName} - {item.size} - {item.price} TL</li>
                                                ))}
                                            </ul>
                                            <h6>Toplam Fiyat: {paymentInfo.totalPrice} TL</h6>
                                        </div>
                               
                                    </div>
                                </div>
                            </div>
                            <div className="card mb-4 custom-card">
                                <div className="card-body">
                                    <div>
                                        <h2 className="card-title">Teslimat Bilgileri</h2>
                                        <div className="form-group">
                                            <label htmlFor="name">İsim:</label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="form-control"
                                                value={userInfo.name}
                                                onChange={(event) => setUserInfo({ ...userInfo, name: event.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="surname">Soyisim:</label>
                                            <input
                                                type="text"
                                                id="surname"
                                                className="form-control"
                                                value={userInfo.surname}
                                                onChange={(event) => setUserInfo({ ...userInfo, surname: event.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Mail:</label>
                                            <input
                                                type="text"
                                                id="email"
                                                className="form-control"
                                                value={userInfo.email}
                                                onChange={(event) => setUserInfo({ ...userInfo, email: event.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phoneNumber">Telefon Numarası:</label>
                                            <input
                                                type="text"
                                                id="phoneNumber"
                                                className="form-control"
                                                value={userInfo.phoneNumber}
                                                onChange={(event) => setUserInfo({ ...userInfo, phoneNumber: event.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="address">Adres:</label>
                                            <textarea
                                                id="address"
                                                className="form-control"
                                                value={userInfo.address}
                                                onChange={(event) => setUserInfo({ ...userInfo, address: event.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-7 col-lg-5 col-xl-4 mb-4">
                            <div className="card" style={{ borderRadius: '15px' }}>
                                <div className="card-body p-4">
                                    <form>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="form-outline">
                                                <input
                                                    type="text"
                                                    id="typeText"
                                                    className="form-control form-control-lg"
                                                    size="17"
                                                    placeholder="1234 5678 9012 3457"
                                                    minLength="19"
                                                    maxLength="19"
                                                />
                                                <label className="form-label" htmlFor="typeText">
                                                    Kart Numarası
                                                </label>
                                            </div>
                                            <img
                                                src="https://img.icons8.com/color/48/000000/visa.png"
                                                alt="visa"
                                                width="64px"
                                            />
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <div className="form-outline">
                                                <input
                                                    type="text"
                                                    id="typeName"
                                                    className="form-control form-control-lg"
                                                    size="17"
                                                    placeholder="İsim Soyisim"
                                                />
                                                <label className="form-label" htmlFor="typeName">
                                                    Kartın Üzerindeki İsim
                                                </label>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center pb-2">
                                            <div className="form-outline">
                                                <input
                                                    type="text"
                                                    id="typeExp"
                                                    className="form-control form-control-lg"
                                                    placeholder="AA/YYYY"
                                                    size="7"
                                                    minLength="7"
                                                    maxLength="7"
                                                />
                                                <label className="form-label" htmlFor="typeExp">
                                                    Son Kullanma Tarihi
                                                </label>
                                            </div>
                                            <div className="form-outline">
                                                <input
                                                    type="password"
                                                    id="typeText2"
                                                    className="form-control form-control-lg"
                                                    placeholder="&#9679;&#9679;&#9679;"
                                                    size="1"
                                                    minLength="3"
                                                    maxLength="3"
                                                />
                                                <label className="form-label" htmlFor="typeText2">
                                                    CVV
                                                </label>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div style={{textAlign: "right"}}>
                                <button
                                 onClick={handleCompletePurchase}
                                    style={{
                                        margin: '15px',
                                        padding: '10px',
                                        backgroundColor: 'green',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Alışverişi tamamla
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default PaymentPage;
