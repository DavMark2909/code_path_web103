import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ViewCreator.css';
import { supabase } from '../client';

const ViewCreator = ({ creators, setCreators }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreator = async () => {
      try {

        const { data, error } = await supabase
          .from('creators')
          .select()
          .eq('id', id)
          .single(); 
        
        if (error) throw error;
        setCreator(data);
        
      } catch (error) {
        console.error('Error fetching creator:', error);
        const foundCreator = creators.find(c => c.id === id || c.id === parseInt(id));
        setCreator(foundCreator);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [id, creators]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${creator.name}?`)) {
      try {

        const { error } = await supabase
          .from('creators')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        const updatedCreators = creators.filter(c => c.id !== id && c.id !== parseInt(id));
        setCreators(updatedCreators);
        
        localStorage.setItem('creators', JSON.stringify(updatedCreators));
        
        navigate('/');
      } catch (error) {
        console.error('Error deleting creator:', error);
        alert('Failed to delete creator. Please try again.');
      }
    }
  };

  const handleVisitChannel = () => {
    if (creator.url) {
      window.open(creator.url, '_blank');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!creator) {
    return (
      <div className="creator-not-found">
        <h2>Creator not found</h2>
        <Link to="/" className="back-btn">Back to Home</Link>
      </div>
    );
  }


  return (
    <div className="view-creator">
      <Link to="/" className="back-link">← Back to Creators</Link>
      
      <div className="creator-profile">
        <div className="profile-header">
          {creator.imageURL && (
            <img 
              src={creator.imageURL} 
              alt={`${creator.name}'s profile`}
              className="profile-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div className="profile-info">
            <h1 className="profile-name">{creator.name}</h1>
            <p className="profile-description">{creator.description}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            onClick={handleVisitChannel}
            className="visit-channel-btn"
          >
             Visit Channel
          </button>
          <Link 
            to={`/edit/${creator.id}`} 
            className="edit-profile-btn"
          >
             Edit Creator
          </Link>
          <button 
            onClick={handleDelete}
            className="delete-profile-btn"
          >
             Delete Creator
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCreator;