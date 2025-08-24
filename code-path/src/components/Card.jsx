import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

const Card = ({ creator, onDelete }) => {
  const { id, name, url, description, imageURL } = creator;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      onDelete(id);
    }
  };

  const handleVisitChannel = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="creator-card">
      <div className="card-header">
        {imageURL && (
          <img 
            src={imageURL} 
            alt={`${name}'s profile`}
            className="creator-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <h3 className="creator-name">{name}</h3>
      </div>
      
      <div className="card-content">
        <p className="creator-description">{description}</p>
      </div>
      
      <div className="card-actions">
        <button 
          onClick={handleVisitChannel}
          className="visit-btn"
        >
          Visit Channel
        </button>
        <Link to={`/creator/${id}`} className="view-btn">
          View Details
        </Link>
        <Link to={`/edit/${id}`} className="edit-btn">
          Edit
        </Link>
        <button 
          onClick={handleDelete}
          className="delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Card;