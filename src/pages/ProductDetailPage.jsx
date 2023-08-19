import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/footer/Footer';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

function ProductDetailPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [cartItemCount, setCartItemCount] = useState(JSON.parse(localStorage.getItem('cart'))?.length || 0);
    const isMobile = window.innerWidth <= 768;

    useEffect(() => {
        fetch(`/products/${productId}`)
            .then((response) => response.json())
            .then((data) => setProduct(data))
            .catch((error) => console.error('Ürün detayları alınırken bir hata oluştu:', error));
    }, [productId]);

    if (!product) {
        return <div>Ürün bulunamadı.</div>;
    }


    const handleSizeChange = (event) => {
        const selectedSize = event.target.value;
        setSelectedSize(selectedSize); // Seçilen bedeni güncelle
    };

    const handleThumbnailClick = (image) => {
        setSelectedImage(image);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Lütfen bir beden seçin.");
            return;
        }

        const cartItem = {
            productId: product.id,
            brand: product.brand,
            productName: product.productName,
            price: product.price,
            size: selectedSize,
            image: product.imageBase64List[0],
        };

        const existingCart = localStorage.getItem('cart');
        const cart = existingCart ? JSON.parse(existingCart) : [];
        cart.push(cartItem);

        localStorage.setItem('cart', JSON.stringify(cart));
        setCartItemCount(cart.length);
        alert("Ürün sepete eklendi.");
    };

    return (
        <div>
            <Navbar cartItemCount={cartItemCount} />
            <div className="container py-5">
                <Container>
                    <Row>
                        {isMobile ? (
                            <Col md={12}>
                                <div className="thumbnail-gallery d-flex flex-wrap">
                                    <OwlCarousel items={1} className="thumbnail-gallery">
                                        {product.imageBase64List.map((base64Image, index) => (
                                            <div
                                                key={index}
                                                className={`thumbnail-item ${selectedImage === base64Image ? 'selected' : ''}`}
                                                onClick={() => handleThumbnailClick(base64Image)}
                                            >
                                                <img
                                                    src={`data:image/jpeg;base64,${base64Image}`}
                                                    alt={`Product ${product.id} Image ${index}`}
                                                    width="100px"
                                                    height="280px"
                                                />
                                            </div>
                                        ))}
                                    </OwlCarousel>
                                </div>
                            </Col>
                        ) : (
                            <Col md={7}>
                            <div className="d-flex">
                                <div className="d-flex flex-column">
                                    {product.imageBase64List.map((base64Image, index) => (
                                        <div
                                            key={index}
                                            className={`thumbnail-item ${selectedImage === base64Image ? 'selected' : ''}`}
                                            onClick={() => handleThumbnailClick(base64Image)}
                                            style={{margin:"17px"}}
                                        >
                                            <img
                                                src={`data:image/jpeg;base64,${base64Image}`}
                                                alt={`Product ${product.id} Image ${index}`}
                                                width="100px"
                                                height="100px"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="thumbnail-gallery">
                                    <Image
                                        src={`data:image/png;base64,${selectedImage || product.imageBase64List[0]}`}
                                        alt={`Ürün Resmi`}
                                        width="600px"
                                        height="620px"
                                        style={{ border: "1px solid #F0F0F0", borderRadius: '10px', boxShadow: '1px 2px 4px #E8E8E8' }}
                                    />
                                </div>
                            </div>
                        </Col>
                        )}
                        <Col md={5}>
                            <br />
                            <h2> {product.brand}<br />{product.productName}</h2><br />
                            <h4>Fiyat:  {`${product.price} TL`}</h4><br />
                            <Col md={12}>
                                <select onChange={handleSizeChange} style={{ width: '100%', padding: '10px', borderRadius: '10px', boxShadow: '1px 2px 4px #E8E8E8' }}>
                                    <option value="">Beden Seçimi Yapınız</option>
                                    {product.sizeStocks.map((sizeData, index) => (
                                        <option key={index} value={sizeData.size} disabled={sizeData.stock === 0} style={{ color: sizeData.stock === 0 ? 'grey' : 'black', backgroundColor: sizeData.stock === 0 ? '#F0F0F0' : 'white' }}>
                                            {sizeData.size}
                                        </option>
                                    ))}
                                </select>
                            </Col>
                            <br />
                            <Col md={12}>
                                <Button variant="primary" onClick={handleAddToCart} style={{ width: '100%', fontSize: '18px', boxShadow: '1px 2px 4px #E8E8E8' }}>Sepete Ekle</Button>
                            </Col>
                            <br />
                            <Row>
                                <Col md={6}>
                                    <div style={{ backgroundColor: '#F0F0F0', padding: '10px', borderRadius: '10px', boxShadow: '1px 2px 4px grey', margin:"2px" }}>
                                        <h5>Ücretsiz Kargo</h5>
                                        <p>800 TL ve üzeri alışverişlerinizde kargo ücretsiz.</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div style={{ backgroundColor: '#F0F0F0', padding: '10px', borderRadius: '10px', boxShadow: '1px 2px 4px grey', margin:"2px" }}>
                                        <h5>Kolay Değişim & İade</h5>
                                        <p>30 gün içerisinde iade ve değişim hakkı.</p>
                                    </div>
                                </Col>
                            </Row><br />
                            <Col md={12}>
                                <div style={{ backgroundColor: '#F0F0F0', padding: '10px', borderRadius: '10px', boxShadow: '1px 2px 4px grey' }}>
                                    <h5>Ürün Detayları</h5>
                                    <div>Marka: {product.brand}</div>
                                    <div>Model: {product.productName}</div>
                                    <div>Cinsiyet: {product.gender}</div>
                                </div>
                            </Col>
                        </Col>

                    </Row>
                </Container>
            </div>
            <Footer />
        </div>
    );
}

export default ProductDetailPage;