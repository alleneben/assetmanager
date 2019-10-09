import React from 'react';
import { Link } from 'react-router-dom';





const WagonCard = ({ name,link }) => {

  return (
    <Link to={`${link}`}>
    <div className="card-product">
      <div className="card-product-infos">
        <h2>{ name }</h2>
        <p>All assets in  <strong>{ name }</strong></p>
      </div>
    </div>
    </Link>
  )
}

export default WagonCard;
