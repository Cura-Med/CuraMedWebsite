import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { image, title, description } = product;
  
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={title} />
      </div>
      <div className="product-content">
        <h3 className="product-title">{title}</h3>
        <p className="product-description">{description}</p>
        <button className="btn product-btn">Learn More</button>
      </div>
    </div>
  );
};

export default ProductCard;
