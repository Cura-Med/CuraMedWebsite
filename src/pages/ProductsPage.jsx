import React, { useState } from 'react';
import './ProductsPage.css';
import product1 from '../assets/product1.jpg';
import product2 from '../assets/product2.jpg';
import product3 from '../assets/product3.jpg';
import product4 from '../assets/product4.jpg';
import product5 from '../assets/product5.jpg';
import product6 from '../assets/product6.jpg';

const ProductsPage = () => {
  const categories = [
    'All Products',
    'Diagnostic Equipment',
    'Patient Monitoring',
    'Surgical Instruments',
    'Medical Furniture',
    'Rehabilitation Equipment'
  ];

  const products = [
    {
      id: 1,
      name: 'Advanced Ultrasound System',
      category: 'Diagnostic Equipment',
      image: product1,
      description: 'High-resolution ultrasound system with advanced imaging capabilities for accurate diagnosis.',
      features: [
        'High-resolution imaging',
        'Multiple probe options',
        'User-friendly interface',
        'Compact and portable design'
      ]
    },
    {
      id: 2,
      name: 'Patient Vital Signs Monitor',
      category: 'Patient Monitoring',
      image: product2,
      description: 'Comprehensive monitoring system for tracking patient vital signs with high accuracy.',
      features: [
        'Real-time monitoring',
        'Touch screen display',
        'Wireless connectivity',
        'Long battery life'
      ]
    },
    {
      id: 3,
      name: 'Precision Surgical Kit',
      category: 'Surgical Instruments',
      image: product3,
      description: 'Complete set of high-quality surgical instruments for various medical procedures.',
      features: [
        'Stainless steel construction',
        'Precision-engineered',
        'Sterilization-compatible',
        'Ergonomic design'
      ]
    },
    {
      id: 4,
      name: 'Electric Hospital Bed',
      category: 'Medical Furniture',
      image: product4,
      description: 'Adjustable electric hospital bed with multiple positioning options for patient comfort.',
      features: [
        'Electric height adjustment',
        'Multiple positioning options',
        'Built-in safety features',
        'Easy-to-clean surfaces'
      ]
    },
    {
      id: 5,
      name: 'Physical Therapy Equipment Set',
      category: 'Rehabilitation Equipment',
      image: product5,
      description: 'Comprehensive set of rehabilitation equipment for physical therapy and patient recovery.',
      features: [
        'Versatile exercise options',
        'Adjustable resistance levels',
        'Durable construction',
        'Compact storage'
      ]
    },
    {
      id: 6,
      name: 'Digital X-Ray System',
      category: 'Diagnostic Equipment',
      image: product6,
      description: 'Advanced digital X-ray system providing clear images with reduced radiation exposure.',
      features: [
        'Digital image processing',
        'Low radiation dose',
        'Rapid image acquisition',
        'PACS integration'
      ]
    }
  ];

  const [activeCategory, setActiveCategory] = useState('All Products');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = activeCategory === 'All Products' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSelectedProduct(null);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleBackClick = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="products-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Our Products</h1>
          <p className="page-subtitle">Explore our range of high-quality medical equipment</p>
        </div>
      </section>
      
      <section className="section products-section">
        <div className="container">
          <div className="product-categories">
            {categories.map((category, index) => (
              <button 
                key={index} 
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {selectedProduct ? (
            <div className="product-detail">
              <button className="back-btn" onClick={handleBackClick}>
                &larr; Back to Products
              </button>
              <div className="product-detail-content">
                <div className="product-detail-image">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                <div className="product-detail-info">
                  <h2 className="product-detail-name">{selectedProduct.name}</h2>
                  <p className="product-detail-category">{selectedProduct.category}</p>
                  <p className="product-detail-description">{selectedProduct.description}</p>
                  <div className="product-features">
                    <h3>Key Features</h3>
                    <ul>
                      {selectedProduct.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <button className="btn product-inquiry-btn">Request Information</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div className="product-card" key={product.id} onClick={() => handleProductClick(product)}>
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-content">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-description">{product.description}</p>
                    <button className="btn product-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
