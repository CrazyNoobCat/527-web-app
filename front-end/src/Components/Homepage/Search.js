import React from 'react';

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
    'Action', 'Adventure', 'Crime', 'Comedy', 'Drama',
    'Family', 'History', 'Horror', 'Romance', 'Thriller'
  ];

  const categoryStyle = {
    padding: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
    borderRadius: '15px',
    textAlign: 'center'
  };
  

  return (
    <div style={searchAndCategoriesStyle}>
      <input type="text" placeholder="Search" style={searchBarStyle} />
      <h2> Browse by Categories</h2>
      <div>
        {categories.map((category, index) => (
          <div key={index} style={categoryStyle}>
            {category}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchAndCategories;