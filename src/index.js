import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

const App = ()=> {
  const [movies, setMovies] = useState([]);
  useEffect(()=> {
    const fetchMovies = async()=> {
      const response = await axios.get('/api/movies');
      setMovies(response.data);
    };

    fetchMovies();
  },  []);
  return (
    <div>
      <h1>Movies({ movies.length })</h1>
      <ul>
        {
          movies.map( movie => {
            return (
              <li key={ movie.id }>
                { movie.title } Stars:{movie.stars}
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);