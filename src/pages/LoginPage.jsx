import React, { useState, useEffect } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {


  const [loginOrSignup, setLoginOrSignup] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: ''
  });
  const navigate = useNavigate();

  const addToUser = (event) => {
    event.preventDefault();
    const requestData = {
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
    };

    fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Response from server:', data);
        setFormData({
          name: '',
          surname: '',
          email: '',
          password: '',
          phoneNumber: '',
          address: ''
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const handleLogin = () => {
    const requestData = {
      email: formData.email,
      password: formData.password,
    };

    fetch('/users/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Authentication failed.');
        }
      })
      .then((data) => {
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/cart');
        setFormData({
          email: '',
          password: '',
        });
      })
      .catch((error) => {
        console.error(error);
        alert("Email veya şifre yanlış");

      });
  };
  return (
    <div>
      <section className="vh-100" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white',  marginTop: loginOrSignup === 'signup' ? '90px' : '0', }}>
        <div className="container py-5">
          <div className="row d-flex justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div style={{
                borderRadius: '1rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#F8F8F8',
                padding: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    cursor: 'pointer',
                    fontWeight: loginOrSignup === 'login' ? 'bold' : 'normal',
                    backgroundColor: loginOrSignup === 'login' ? 'white' : '#F8F8F8',
                    flexGrow: 1,
                    textAlign: 'center',
                    padding: '10px',
                    borderRadius: '10px'
                  }}
                    onClick={() => setLoginOrSignup('login')}>
                    Sign in
                  </div>
                  <div style={{ width: '1px', height: '30px', backgroundColor: 'black', margin: '0 10px' }}></div>
                  <div style={{
                    cursor: 'pointer',
                    fontWeight: loginOrSignup === 'signup' ? 'bold' : 'normal',
                    backgroundColor: loginOrSignup === 'signup' ? 'white' : '#F8F8F8',
                    flexGrow: 1,
                    textAlign: 'center',
                    padding: '10px',
                    borderRadius: '10px'
                  }}
                    onClick={() => setLoginOrSignup('signup')}>
                    Sign up
                  </div>
                </div>
                <br />
                <div className="form-outline mb-4">
                  <label className="form-label">
                    Email
                  </label>
                  <input type="email" id="typeEmailX-2" className="form-control form-control-lg" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="typePasswordX-2">
                    Password
                  </label>
                  <input type="password" id="typePasswordX-2" className="form-control form-control-lg" value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>

                {loginOrSignup === 'signup' && (
                  <div className="form-outline mb-4">
                    <label className="form-label" >
                      Name
                    </label>
                    <input type="text" id="typeName" className="form-control form-control-lg" value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                )}

                {loginOrSignup === 'signup' && (
                  <div className="form-outline mb-4">
                    <label className="form-label">
                      Surname
                    </label>
                    <input type="text" id="typeSurname" className="form-control form-control-lg" value={formData.surname}
                      onChange={(e) => setFormData({ ...formData, surname: e.target.value })} />
                  </div>
                )}

                {loginOrSignup === 'signup' && (
                  <div className="form-outline mb-4">
                    <label className="form-label" >
                      Phone Number
                    </label>
                    <input type="text" id="typePhone" className="form-control form-control-lg" value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                  </div>
                )}

                {loginOrSignup === 'signup' && (
                  <div className="form-outline mb-4">
                    <label className="form-label" >
                      Address
                    </label>
                    <input type="text" id="typeAddress" className="form-control form-control-lg" value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                )}

                <button className="btn btn-primary btn-lg btn-block" type="button" onClick={loginOrSignup === 'login' ? handleLogin : addToUser}>
                  {loginOrSignup === 'login' ? 'Login' : 'Sign up'}
                </button>


                <hr style={{ margin: '1rem 0', border: 'none', height: '1px', backgroundColor: '#E0E0E0' }} />
                <div style={{
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '10px'
                }}>
                  <button
                    className="btn btn-lg btn-block"
                    style={{ backgroundColor: '#F0F0F0' }}
                    type="button"
                    onClick={() => setLoginOrSignup(loginOrSignup === 'login' ? 'signup' : 'login')}
                  >
                    <FaGoogle className="me-2" /> Login with Google
                  </button>
                  <button
                    className="btn btn-lg btn-block"
                    style={{ backgroundColor: '#F0F0F0' }}
                    type="button"
                    onClick={() => {
                      const nullUser = {
                        id: null,
                        name: null,
                        surname: null,
                        email: null,
                        phoneNumber: null,
                        address: null
                      };

                      localStorage.setItem('user', JSON.stringify(nullUser));
                      navigate('/payment');
                    }}
                  >
                    Üye olmadan devam et
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
