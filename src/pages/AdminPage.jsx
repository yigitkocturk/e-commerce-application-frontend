import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

export const categories = ['Spor', 'Bot', 'Klasik', 'Terlik'];
export const genders = ['Erkek', 'Kadın', 'Çocuk'];
export const brands = ['Nike', 'Adidas', 'Puma', 'Jordan', 'Polo', 'Lumberjack', 'Crocs'];


const AdminPage = () => {
  const initialSizeStocks = {
    Erkek: ['38', '39', '40', '41', '42', '43', '44', '45'].map((size) => ({ size, stock: '' })),
    Kadın: ['35', '36', '37', '38', '39', '40'].map((size) => ({ size, stock: '' })),
    Çocuk: ['28', '29', '30', '31', '32', '33', '34'].map((size) => ({ size, stock: '' })),
  };
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showSizeStocks, setShowSizeStocks] = useState(false);
  const [showUpdateFields, setShowUpdateFields] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newProduct, setNewProduct] = useState({
    barcodeNo: '',
    brand: '',
    productName: '',
    price: '',
    gender: '',
    category: '',
    sizeStocks: initialSizeStocks.Erkek,
    imageFiles: [],
  });

  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    setShowSizeStocks(!!selectedGender);
    setNewProduct({
      ...newProduct,
      gender: selectedGender,
      sizeStocks: initialSizeStocks[selectedGender] || [],
    });
  };

  const handleInputChange = (index, field, value) => {
    const sizeStocks = [...newProduct.sizeStocks];
    sizeStocks[index][field] = value;
    setNewProduct({ ...newProduct, sizeStocks });
  };

  const handleSizeStockChange = () => {
    setNewProduct({
      ...newProduct,
      sizeStocks: [...newProduct.sizeStocks, { size: '', stock: '' }],
    });
  };

  const handleImageFileChange = (e) => {
    setNewProduct((prevProduct) => ({ ...prevProduct, imageFiles: Array.from(e.target.files) }));
  };



  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('barcodeNo', newProduct.barcodeNo);
      formData.append('brand', newProduct.brand);
      formData.append('productName', newProduct.productName);
      formData.append('price', newProduct.price);
      formData.append('gender', newProduct.gender);
      formData.append('category', newProduct.category);

      newProduct.sizeStocks.forEach((sizeStock, index) => {
        formData.append(`sizeStocks[${index}].size`, sizeStock.size);
        formData.append(`sizeStocks[${index}].stock`, sizeStock.stock);
      });

      newProduct.imageFiles.forEach((imageFile, index) => {
        formData.append(`imageFiles[${index}]`, imageFile);
      });

      const response = await axios.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setNewProduct({
          barcodeNo: '',
          brand: '',
          productName: '',
          price: '',
          gender: '',
          category: '',
          sizeStocks: initialSizeStocks.Erkek,
          imageFiles: [],
        });

        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = (productId) => {
    fetch(`/products/${productId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const updatedProducts = products.filter((product) => product.id !== productId);
        setProducts(updatedProducts);
      })
      .catch((error) => {
        console.error('Ürün silinirken hata oluştu:', error);
      });
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin') {
      setIsLoggedIn(true);
      console.log(products)
    } else {
      alert('Invalid username or password');
    }
  };

  const handlePriceInputChange = (value) => {
    setSelectedProduct(prevSelectedProduct => ({
      ...prevSelectedProduct,
      price: value
    }));
  };
  
  const handleSizeStockInputChange = (index, field, value) => {
    const updatedProduct = { ...selectedProduct };
    updatedProduct.sizeStocks[index][field] = value;
    setSelectedProduct(updatedProduct);
  };

  const handleProductUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('price', selectedProduct.price);
      selectedProduct.sizeStocks.forEach((sizeStock, index) => {
        formData.append(`sizeStocks[${index}].size`, sizeStock.size);
        formData.append(`sizeStocks[${index}].stock`, sizeStock.stock);
      });

      const response = await axios.put(`/products/${selectedProduct.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        fetchProducts();
        setShowProductForm(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', }}>
        <form onSubmit={handleLoginSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', maxWidth: '400px', width: '100%', boxShadow: '1px 2px 4px grey' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', fontWeight: 'bold' }}>Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '1px 2px 4px grey' }}
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', fontWeight: 'bold' }}>Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '1px 2px 4px grey' }}
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', boxShadow: '1px 2px 4px blue', fontWeight: 'bold' }}>Login</button>
          </div>

        </form>
      </div>
    );
  }


  return (
    <div className="added-products-container" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div>
        <div className="row">
          <div className="col-md-6">
            <button
              className="add-product-btn"
              onClick={() => setShowProductForm(!showProductForm)}
              style={{
                padding: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                marginBottom: '10px',
                cursor: 'pointer',
              }}
            >
              {showProductForm ? 'Ürün Ekleme Bilgilerini Gizle' : 'Ürün Ekle'}
            </button>
            {showProductForm && (
              <form
                onSubmit={handleProductSubmit}
                className="product-form"
                style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}
              >
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ marginBottom: '5px' }}>Barkod Numarası:</label>
                  <input
                    type="text"
                    name="barcodeNo"
                    value={newProduct.barcodeNo}
                    onChange={(e) => setNewProduct({ ...newProduct, barcodeNo: e.target.value })}
                    required
                    style={{ padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ marginBottom: '5px' }}>Ürün Adı:</label>
                  <input
                    type="text"
                    name="productName"
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                    required
                    style={{ padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ marginBottom: '5px' }}>Marka:</label>
                  <select
                    name="brand"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    required
                    style={{ padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                  >
                    <option value="">Seçiniz</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ marginBottom: '5px' }}>Fiyat:</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                    style={{ padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ marginBottom: '5px' }}>Cinsiyet:</label>
                  <select
                    name="gender"
                    value={newProduct.gender}
                    onChange={handleGenderChange}
                    required
                    style={{ padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                  >
                    <option value="">Seçiniz</option>
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ marginBottom: '5px' }}>Kategori:</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                    style={{ padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                  >
                    <option value="">Seçiniz</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                {showSizeStocks && (
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label style={{ marginBottom: '5px' }}>Bedenler ve Stoklar:</label>
                    {newProduct.sizeStocks.map((sizeStock, index) => (
                      <div key={index} className="size-stock-group">
                        <div>
                          <input
                            type="text"
                            name={`sizeStocks[${index}].size`}
                            placeholder="Beden"
                            value={sizeStock.size}
                            onChange={(e) => handleInputChange(index, 'size', e.target.value)}
                            required
                            style={{ padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            name={`sizeStocks[${index}].stock`}
                            placeholder="Stok"
                            value={sizeStock.stock}
                            onChange={(e) => handleInputChange(index, 'stock', e.target.value)}
                            required
                            style={{ padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                          />
                        </div>
                      </div>
                    ))}
                    <div>
                      <button
                        type="button"
                        onClick={handleSizeStockChange}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                      >
                        Yeni Beden Ekle
                      </button>
                    </div>
                  </div>
                )}
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ marginBottom: '5px' }}>Resim 1:</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageFileChange}
                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    marginTop: '10px',
                    cursor: 'pointer',
                  }}
                >
                  Kaydet
                </button>
              </form>
            )}
          </div>
          <div className="col-md-6">
            {showUpdateFields && selectedProduct && (
              <form
                onSubmit={handleProductUpdate}
                className="product-form"
                style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}
              >
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ marginBottom: '5px' }}>Fiyat:</label>
                  <input
                    type="number"
                    name="price"
                    value={selectedProduct.price}
                    onChange={(e) => handlePriceInputChange(e.target.value)}
                    required
                    style={{ padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ marginBottom: '5px' }}>Bedenler ve Stoklar:</label>
                  {selectedProduct.sizeStocks.map((sizeStock, index) => (
                    <div key={index} className="size-stock-group">
                      <div>
                        <input
                          type="text"
                          name={`sizeStocks[${index}].size`}
                          placeholder="Beden"
                          value={sizeStock.size}
                          onChange={(e) => handleSizeStockInputChange(index, 'size', e.target.value)} // Burada güncelleme yapılıyor
                          required
                          style={{ padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name={`sizeStocks[${index}].stock`}
                          placeholder="Stok"
                          value={sizeStock.stock}
                          onChange={(e) => handleSizeStockInputChange(index, 'stock', e.target.value)}
                          required
                          style={{ padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    marginTop: '10px',
                    cursor: 'pointer',
                  }}
                >
                  Güncelle
                </button>
              </form>
            )}
          </div>
        </div>
        <h2 style={{ marginBottom: '10px', color: '#333' }}>Ürünler</h2>

        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            border: '1px solid #ddd',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Barkod Numarası</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Ürün Adı</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Marka</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Fiyat</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Cinsiyet</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Kategori</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Stoklar</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Resimler</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.barcodeNo}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.productName}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.brand}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.price}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.gender}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.category}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <ul style={{ margin: '0', padding: '0', listStyleType: 'none' }}>
                    {product.sizeStocks.map((sizeStock, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>
                        {sizeStock.size}: {sizeStock.stock}
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {product.imageBase64List.map((base64Image, index) => (
                    <img
                      key={index}
                      src={`data:image/jpeg;base64,${base64Image}`}
                      alt={`Product ${product.id} Image ${index}`}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ))}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowUpdateFields(true);
                    }}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      marginRight: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Güncelle
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default AdminPage;