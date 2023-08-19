import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/footer/Footer';
import { Link, useLocation } from 'react-router-dom';



const categories = ['Tüm Kategoriler', 'Spor', 'Bot', 'Terlik', 'Klasik'];
const genders = ['Erkek', 'Kadın', 'Çocuk'];
const brands = ['Tüm Markalar', 'Nike', 'Adidas', 'Puma', 'Jordan', 'Polo', 'Lumberjack', 'Crocs'];

function ProductListPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tüm Kategoriler');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Tüm Markalar');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedGenderFromQuery = queryParams.get('gender');
  const selectedBrandFromQuery = queryParams.get('brand');
  const selectedCategoryFromQuery = queryParams.get('category')
  const cartItemCount = JSON.parse(localStorage.getItem('cart'))?.length || 0;


  useEffect(() => {
    if (selectedGenderFromQuery) {
      setSelectedGender(selectedGenderFromQuery);
    }
    if (selectedBrandFromQuery) {
      setSelectedBrand(selectedBrandFromQuery);
    }
    if (selectedCategoryFromQuery) {
      setSelectedCategory(selectedCategoryFromQuery)
    }
  }, [selectedGenderFromQuery, selectedBrandFromQuery, selectedCategoryFromQuery]);


  useEffect(() => {
    fetch('/products')
      .then((response) => response.json())
      .then(
        (data) => {
          setProducts(data);
          setLoading(false);
        },
        (error) => {
          setError(error);
          setLoading(false);
        }
      );
  }, []);
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };



  useEffect(() => {
    const applyFilters = () => {
      let filtered = products;
      if (selectedCategory !== 'Tüm Kategoriler') {
        filtered = filtered.filter((product) => product.category === selectedCategory);
      }
      if (selectedGender !== '') {
        filtered = filtered.filter((product) => product.gender === selectedGender);
      }
      if (selectedBrand !== 'Tüm Markalar') {
        filtered = filtered.filter((product) => product.brand === selectedBrand);
      } if (sortOrder === "asc") {
        filtered = filtered.sort((a, b) => a.price - b.price);
      } if (sortOrder === "desc") {
        filtered = filtered.sort((a, b) => b.price - a.price);
      }
      setFilteredProducts(filtered);
    };
    applyFilters();
  }, [selectedCategory, selectedGender, sortOrder, selectedBrand, products]);


  const handleProductClick = (product) => {
    return (
      <Link
        to={{
          pathname: `/products/${product.id}`,
          state: { product },
        }}
      />
    );
  };

  return (
    <div>
      <Navbar cartItemCount={cartItemCount} />
      <div className="container py-5 px-lg-6">
        <Container>
          <Row>
            <Col md={3} className='mobile-hide'>
              <div style={{ border: "1px solid #F0F0F0", borderRadius: '10px', padding: '10px', margin: '10px', boxShadow: '1px 2px 4px #DCDCDC' }}>
                <h3>Kategoriler</h3>
                <Form>
                  <Form.Group controlId="categorySelect">
                    {categories.map((category) => (
                      <Form.Check
                        key={category}
                        type="radio"
                        name="categorySelect"
                        id={`categorySelect_${category}`}
                        label={category}
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                      />
                    ))}
                  </Form.Group>
                </Form>
              </div>
              <div style={{ border: "1px solid #F0F0F0", borderRadius: '10px', padding: '10px', margin: '10px', boxShadow: '1px 2px 4px #DCDCDC' }}>
                <h3>Cinsiyet</h3>
                <Form>
                  <Form.Group controlId="genderSelect">
                    {genders.map((gender) => (
                      <Form.Check
                        key={gender}
                        type="radio"
                        name="genderSelect"
                        id={`genderSelect_${gender}`}
                        label={gender}
                        checked={selectedGender === gender}
                        onChange={() => setSelectedGender(gender)}
                      />
                    ))}
                  </Form.Group>
                </Form>
              </div>
              <div style={{ border: "1px solid #F0F0F0", borderRadius: '10px', padding: '10px', margin: '10px', boxShadow: '1px 2px 4px #DCDCDC' }}>
                <h3>Markalar</h3>
                <Form>
                  <Form.Group controlId="brandSelect">
                    {brands.map((brand) => (
                      <Form.Check
                        key={brand}
                        type="radio"
                        name="brandSelect"
                        id={`brandSelect_${brand}`}
                        label={brand}
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand)}
                      />
                    ))}
                  </Form.Group>
                </Form>
              </div>
            </Col>
            <Col md={9}>
              <div style={{ marginTop: '10px' }}>
                <Row>
                  <Form.Group controlId="sortSelect" className="float-right" value={sortOrder}
                    onChange={handleSortChange}>
                    <Form.Label>Sırala:</Form.Label>
                    <Form.Control as="select">
                      <option value="asc">Ucuzdan Pahalıya</option>
                      <option value="desc">Pahalıdan Ucuza</option>
                    </Form.Control>
                  </Form.Group>
                </Row>
                <Row>
                  {filteredProducts.map((product) => (
                    <Col
                      key={product.id}
                      md={4}
                      style={{ paddingBottom: '15px' }}
                      onClick={() => handleProductClick(product)}
                    >
                      <div style={{ border: "1px solid #F8F8F8", boxShadow: '1px 2px 4px #F5F5F5' }}>
                        <Link style={{ textDecoration: 'none' }} to={`/products/${product.id}`}>
                          <div key={product.id} className="card" style={{ height: '480px' }}>
                            <img src={`data:image/png;base64,${product.imageBase64List[0]}`} className="card-img-top" alt="..."
                              style={{ height: '300px', width: '100%', border: '1px solid #F8F8F8', borderRadius: '10px', boxShadow: ' 0px 15px 10px -15px grey' }} />
                            <div className="card-body">
                              <div><h5 className="card-title">{product.productName}</h5></div>
                            </div>
                            <div style={{ alignItems: 'flex-end', height: '40px', fontSize: '18px', display: 'flex', padding: '10px' }}>
                              <p className="card-text">{product.brand}</p>
                            </div>
                            <div style={{ alignItems: 'flex-end', height: '40px', fontSize: '20px', display: 'flex', paddingLeft: '10px', backgroundColor: '#F8F8F8', borderRadius: '10px', paddingBottom: '2px', fontWeight: 'bold' }}>
                              <p className="card-text">{product.price} TL</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div >
  );
}

export default ProductListPage;
