import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function SearchAndCategories() {
  const searchAndCategoriesStyle = {
    flex: '1',
    backgroundColor: '#E2D0FD28',
    padding: '1.5rem'
  };
  const searchBarStyle = {
    width: '97%', // Full width
    height: '40px', // Set the height
    fontSize: '1.2em', // Set font size
    padding: '5px', // Inner padding
  };

  const categories = [
    'Action', 'Animation', 'Crime', 'Comedy', 'Drama', 'Documentary', 'Family',
    'Fantasy', 'Historical', 'Horror', 'Romance', 'Science Fiction', 'Thriller'
  ];

  const categoryStyle = {
    display: 'block',
    padding: '10px',
    backgroundColor: '#FFFFFF50',
    color: '#000',
    //backgroundColor: 'rgba(0, 0, 0, 0.07)',
    marginBottom: '32px',
    borderRadius: '15px',
    textAlign: 'center', 
    overflowY: 'scroll'
    };
  
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search?query=${inputValue}`);
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  return (
      <div className='sideSearch' style={searchAndCategoriesStyle}>
      <input 
        type="text" 
        placeholder="Search"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        style={searchBarStyle} 
      />
      <div><p></p></div>
      <h2> Browse by Category</h2>
      <div><br/></div>
      {categories.map((category, index) => (
        <Link 
            key={index} 
            to={`/search?genre=${category}`} 
            style={{...categoryStyle, textDecoration: 'none', color: 'inherit'}}
          >
            {category}
        </Link>
        ))}
    </div>
  );
}

export default SearchAndCategories;
