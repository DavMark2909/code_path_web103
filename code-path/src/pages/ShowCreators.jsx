import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { supabase } from '../client';
import './ShowCreators.css';

const ShowCreators = ({ creators, setCreators }) => {

  const handleDeleteCreator = async (creatorId) => {
    try {
      const { error } = await supabase
        .from('creators')
        .delete()
        .eq('id', creatorId);
      
      if (error) throw error;
      
      setCreators(creators.filter(creator => creator.id !== creatorId));
      
      const updatedCreators = creators.filter(creator => creator.id !== creatorId);
      localStorage.setItem('creators', JSON.stringify(updatedCreators));
    } catch (error) {
      console.error('Error deleting creator:', error);
      alert('Failed to delete creator. Please try again.');
    }
  };

  return (
    <div className="show-creators">
      <header className="page-header">
        <h1>Creatorverse</h1>
        <p>Discover amazing content creators!</p>
        <Link to="/add" className="add-creator-btn">
          + Add New Creator
        </Link>
      </header>

      <main className="creators-grid">
        {creators.length === 0 ? (
          <div className="empty-state">
            <h2>No creators yet!</h2>
            <p>Start building your creatorverse by adding some amazing content creators.</p>
            <Link to="/add" className="get-started-btn">
              Get Started
            </Link>
          </div>
        ) : (
          creators.map(creator => (
            <Card
              key={creator.id}
              creator={creator}
              onDelete={handleDeleteCreator}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default ShowCreators;