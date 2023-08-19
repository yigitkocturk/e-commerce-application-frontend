import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/footer/Footer';
import './style.css'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import lumberjack from '../pictures/1-lumberjack.jpg.webp';
import nike from '../pictures/2-nike.jpg.webp';
import adidas from '../pictures/3-adidas.jpg.webp';
import puma from '../pictures/4-puma-396x505.jpg.webp';
import kinetix from '../pictures/5-kinetix.jpg.webp';
import ninewest from '../pictures/6-ninewest-396x505.jpg.webp';
import inci from '../pictures/7-inci.jpg.webp';
import polo from '../pictures/8-us-polo.jpg.webp';
import dockers from '../pictures/9-dockers.jpg.webp';
import polaris from '../pictures/10-polaris-396x505.jpg.webp';
import reebook from '../pictures/-396x505-1684156284.jpg.webp';
import cocuk from '../pictures/cocuk-kategori.webp';
import erkek from '../pictures/erkek-kategori.webp';
import kadın from '../pictures/kadın-kategori.webp';

const options1 = {
  autoplay: true,
  smartSpeed: 1000,
  margin: 25,
  dots: false,
  loop: true,
  responsive: {
      0: {
          items: 1
      },
      992: {
          items: 3
      }
  }
};
const options2 = {
  autoplay: true,
  smartSpeed: 1000,
  margin: 25,
  dots: false,
  loop: true,
  responsive: {
      0: {
          items: 3
      },
      992: {
          items: 7
      }
  }
};
const options3 = {
  autoplay: true,
  smartSpeed: 1000,
  margin: 25,
  dots: false,
  loop: true,
  responsive: {
      0: {
          items: 2
      },
      992: {
          items: 6
      }
  }
};

function Homepage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const cartItemCount = JSON.parse(localStorage.getItem('cart'))?.length || 0;
  const getResponsiveItems = () => {
    if (window.innerWidth >= 1200) {
      return 6;
    } else if (window.innerWidth >= 768) {
      return 4;
    } else {
      return 3;
    }
  };

  useEffect(() => {
    fetch('/products')
      .then((response) => response.json())
      .then(
        (data) => {
          setProducts(data);
          setLoading(false);
          console.log(data);
        },
        (error) => {
          console.log(error);
          setLoading(false);
        }
      );
  }, []);

  return (
    <div>
      <Navbar cartItemCount={cartItemCount} />
      <div className="container py-5 px-lg-6">
        <OwlCarousel items={3} className="owl-theme" loop autoplay={true} {...options1} nav={false} dots={false} margin={8}>
          <Link to={{
            pathname: "/productlist",
            search: `?gender=${encodeURIComponent("Kadın")}`,
          }}
            className="card">
            <img src={kadın} className="card-img-top" alt="..."/>
          </Link>
          <Link to={{
            pathname: "/productlist",
            search: `?gender=${encodeURIComponent("Erkek")}`,
          }} className="card">
            <img src={erkek} className="card-img-top" alt="..." />
          </Link>
          <Link to={{
            pathname: "/productlist",
            search: `?gender=${encodeURIComponent("Çocuk")}`,
          }} className="card">
            <img src={cocuk} className="card-img-top" alt="..." />
          </Link>
        </OwlCarousel>
      </div>
      <div className="container py-5 px-lg-6">
        <div style={{ fontSize: '25px' }}><p><b>En Çok Tercih Edilen Markalar</b></p></div>
        <OwlCarousel items={getResponsiveItems()} className="owl-theme" loop autoplay={true} {...options2} nav={false} dots={false} margin={8}>
          <Link to={{
            pathname: "/productlist",
            search: `?brand=${encodeURIComponent("Lumberjack")}`
          }} > <img className="img brandlogo" src={lumberjack} alt="lumberjack" /></Link>
          <Link to={{
            pathname: "/productlist",
            search: `?brand=${encodeURIComponent("Nike")}`
          }}><img className="img brandlogo" src={nike} alt="nike" /></Link>
          <Link to={{
            pathname: "/productlist",
            search: `?brand=${encodeURIComponent("Adidas")}`
          }}><img className="img brandlogo" src={adidas} alt="adidas" /></Link>
          <Link to={{
            pathname: "/productlist",
            search: `?brand=${encodeURIComponent("Puma")}`
          }}><img className="img brandlogo" src={puma} alt="puma" /></Link>
          <Link to={{
            pathname: "/productlist",
            search: `?brand=${encodeURIComponent("Kinetix")}`
          }}><img className="img brandlogo" src={kinetix} alt="kinetix" /></Link>
          <Link to={{
            pathname: "/productlist",
            search: `?brand=${encodeURIComponent("Polo")}`
          }}><img className="img brandlogo" src={polo} alt="polo" /></Link>
          <Link to={{
            pathname: "/productlist",
            search: `?brand=${encodeURIComponent("Reebook")}`
          }}><img className="img brandlogo" src={reebook} alt="reebook" /></Link>
        </OwlCarousel>
      </div>
      <div className="container py-5 px-lg-6">
        <div style={{ fontSize: '25px' }}><p><b>En Çok Satan Ürünler</b></p></div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <OwlCarousel items={getResponsiveItems()} className="owl-theme" loop autoplay={true} {...options3} nav={false} dots={false} margin={8} >
            {products.map(product => (
              <div style={{ border: "1px solid #F8F8F8", boxShadow: '1px 2px 4px #F5F5F5' }}>
                <Link style={{ textDecoration: 'none' }} to={`/products/${product.id}`}>
                  <div key={product.id} className="card" style={{ height: '430px' }}>
                    <img src={`data:image/jpeg;base64,${product.imageBase64List[0]}`} className="card-img-top" alt="..."
                      style={{ height: '250px', width: '100%', border: '1px solid #F8F8F8', borderRadius: '10px', boxShadow: ' 0px 15px 10px -15px grey' }} />
                    <div className="card-body">
                      <div><h5 className="card-title">{product.productName}</h5></div>
                    </div>
                    <div style={{ alignItems: 'flex-end', height: '40px', fontSize: '18px', display: 'flex', padding: '10px' }}>
                      <p className="card-text">{product.brand}</p>
                    </div>
                    <div style={{ alignItems: 'flex-end', height: '40px', fontSize: '20px', display: 'flex',paddingLeft: '10px',  backgroundColor: '#F8F8F8', borderRadius: '10px', paddingBottom: '2px', fontWeight: 'bold' }}>
                      <p className="card-text">{product.price} TL</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </OwlCarousel>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Homepage;