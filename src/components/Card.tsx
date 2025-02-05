import React from 'react';
import { Dog, Liked } from '../types/index';
import toggleLike from "../utils/toggleLike";



const Card = ({data, liked, setLiked} : {data: Dog, liked:Liked, setLiked: (data: Liked) => void}) => {
  const likedIcon = liked[data.id] && liked[data.id].liked;
    return (
        <div key={data.id} className="col-md-4">
        <div className="card h-100 text-start">
          <div className="relative">
            <img src={data.img} alt={`${data.name}-image`} className="card-img-top pet-card-img"/>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between">
            <h3 className="card-title fw-bold mb-2">{data.name}</h3>
            
            <button className="like-btn" onClick={() => {toggleLike(data, setLiked)}} >
                <h4 className={`text-${likedIcon ? 'danger' : 'dark'}`}>
                  <i className={`bi bi-heart${likedIcon ? '-fill' : ''}`}></i>
                </h4>
              </button>
            </div>
       
            <div className="space-y-1">
              <p className="card-text mb-1">{data.breed}</p>
              <p className="card-text mb-2">
                Age: {data.age} years old
              </p>
              <p className="card-text text-muted small d-flex">
              <i className="bi bi-geo-alt"></i>                          
              {data.zip_code}
              </p>
            </div>
          </div>
         </div>
        </div>
    )
}

export default Card;