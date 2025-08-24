import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './CreatorForm.css';
import { supabase } from '../client';

const EditCreator = ({ creators, setCreators }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    imageURL: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatorExists, setCreatorExists] = useState(false);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const { data, error } = await supabase
          .from('creators')
          .select()
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setFormData({
            name: data.name || '',
            url: data.url || '',
            description: data.description || '',
            imageURL: data.imageURL || ''
          });
          setCreatorExists(true);
        }
        
      } catch (error) {

        const creator = creators.find(c => c.id === id || c.id === parseInt(id));
        if (creator) {
          setFormData({
            name: creator.name || '',
            url: creator.url || '',
            description: creator.description || '',
            imageURL: creator.imageURL || ''
          });
          setCreatorExists(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id, creators]);


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

    setSaving(true);

    try {

      const { data, error } = await supabase
        .from('creators')
        .update({
          name: formData.name,
          url: formData.url,
          description: formData.description,
          imageURL: formData.imageURL
        })
        .eq('id', id)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const updatedCreators = creators.map(creator => 
          (creator.id === id || creator.id === parseInt(id)) ? data[0] : creator
        );
        setCreators(updatedCreators);
        
        localStorage.setItem('creators', JSON.stringify(updatedCreators));
      }
      
      navigate(`/creator/${id}`);
    } catch (error) {
      console.error('Error updating creator:', error);
      alert('Failed to update creator. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!creatorExists) {
    return (
      <div className="creator-not-found">
        <h2>Creator not found</h2>
        <Link to="/" className="back-btn">Back to creators page</Link>
      </div>
    );
  }

  return (
    <div className="creator-form-page">
      <Link to={`/creator/${id}`} className="back-link">Back to Creator</Link>
      
      <div className="form-container">
        <h1>Edit Creator</h1>
        
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
            <button 
              type="submit" 
              className="submit-btn"
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Creator'}
            </button>
            <Link to={`/creator/${id}`} className="cancel-btn">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCreator;