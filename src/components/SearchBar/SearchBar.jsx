import { useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import './SearchBar.css';

export function SearchBar({
  searchInput,
  suggestions,
  handleSearch,
  handleChange,
  handleSelect
}) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelect(suggestions[activeIndex].description);
      } else {
        handleSearch(e);
      }
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="input-wrapper">
          <FaMagnifyingGlass className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city"
            value={searchInput}
            onChange={(e) => {
              handleChange(e);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className={index === activeIndex ? 'active' : ''}
              onClick={() => handleSelect(item.description)}
            >
              {item.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
