import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';
import './CreatorForm.css';

const AddCreator = ({ creators, setCreators }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    imageURL: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('creators')
        .insert([
          {
            name: formData.name,
            url: formData.url,
            description: formData.description,
            imageURL: formData.imageURL
          }
        ])
        .select(); 
      
      if (error) throw error;
      
      if (data && data[0]) {
        const updatedCreators = [...creators, data[0]];
        setCreators(updatedCreators);
        localStorage.setItem('creators', JSON.stringify(updatedCreators));
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error adding creator:', error);
      alert('Failed to add creator. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="creator-form-page">
      <Link to="/" className="back-link">← Back to Creators</Link>
      
      <div className="form-container">
        <h1>Add New Creator</h1>
        
        <form onSubmit={handleSubmit} className="creator-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter creator's name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">Channel/Profile URL *</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about this creator..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageURL">Profile Image URL (optional)</label>
            <input
              type="url"
              id="imageURL"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              placeholder="https://... (optional)"
            />
            {formData.imageURL && (
              <div className="image-preview">
                <img 
                  src={formData.imageURL} 
                  alt="Preview"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Add Creator
            </button>
            <Link to="/" className="cancel-btn">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCreator;