
import { FaMagnifyingGlass } from 'react-icons/fa6';

export function SearchBar({ searchInput, suggestions, handleSearch, handleChange, handleSelect }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 400, margin: '0 auto' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex' }}>
        <input
          type="text"
          placeholder="Search for a city"
          value={searchInput}
          onChange={handleChange}
          style={{ flex: 1, padding: '10px', borderRadius: '6px 0 0 6px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#2b915d',
            border: 'none',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '0 6px 6px 0',
            cursor: 'pointer',
          }}
        >
          <FaMagnifyingGlass />
        </button>
      </form>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => handleSelect(item.description)}>
              {item.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
