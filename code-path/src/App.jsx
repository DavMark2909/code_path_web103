import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowCreators from './pages/ShowCreators';
import ViewCreator from './pages/ViewCreator';
import EditCreator from './pages/EditCreator';
import AddCreator from './pages/AddCreator';
import { supabase } from './client';
import './App.css';

function App() {

  const [creators, setCreators] = useState([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const { data, error } = await supabase
          .from('creators')
          .select();
        
        if (error) throw error;
        setCreators(data || []);
        
        const savedCreators = localStorage.getItem('creators');
        if (savedCreators) {
          setCreators(JSON.parse(savedCreators));
        }
      } catch (error) {
        console.error('Error fetching creators:', error);
        const savedCreators = localStorage.getItem('creators');
        if (savedCreators) {
          setCreators(JSON.parse(savedCreators));
        }
      }
    };

    fetchCreators();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ShowCreators creators={creators} setCreators={setCreators}/>} />
          <Route path="/creator/:id" element={<ViewCreator creators={creators} setCreators={setCreators}/>} />
          <Route path="/edit/:id" element={<EditCreator creators={creators} setCreators={setCreators}/>} />
          <Route path="/add" element={<AddCreator creators={creators} setCreators={setCreators}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;