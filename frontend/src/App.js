import React, { useState } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [medicine, setMedicine] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!medicine.trim()) {
      setError('Please enter a medicine name');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/search/${encodeURIComponent(medicine)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search medicine prices');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitPharmacy = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>MediScout</h1>
        <p>Compare pharmacy prices and save on your medications</p>
      </header>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            placeholder="Enter medicine name (e.g., Paracetamol, Aspirin)"
            className="search-input"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="search-button"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}
      </div>

      {loading && (
        <div className="loading">
          <p>Searching across multiple pharmacies...</p>
        </div>
      )}

      {results && (
        <div className="results-container">
          <div className="results-header">
            <h2>Results for "{results.medicine}"</h2>
            <div className="savings-info">
              <div>
                Best Price: <span className="best-price">₹{results.bestPrice}</span>
              </div>
              <div>
                You can save up to: <span className="savings-amount">₹{results.savings}</span>
              </div>
            </div>
          </div>

          <div className="pharmacy-grid">
            {results.results.map((pharmacy, index) => (
              <div 
                key={index} 
                className={`pharmacy-card ${index === 0 ? 'best-price' : ''}`}
              >
                <div className="pharmacy-header">
                  <div className="pharmacy-name">{pharmacy.pharmacy}</div>
                  {index === 0 && <div className="best-price-badge">Best Price</div>}
                </div>
                
                <div className="price-info">
                  <div className="price">
                    ₹{pharmacy.price}
                    <span className="discount">{pharmacy.discount}% OFF</span>
                  </div>
                </div>

                <div className={`availability ${pharmacy.availability === 'In Stock' ? 'in-stock' : 'out-of-stock'}`}>
                  {pharmacy.availability}
                </div>

                <button 
                  onClick={() => handleVisitPharmacy(pharmacy.url)}
                  disabled={pharmacy.availability === 'Out of Stock'}
                  className="visit-button"
                >
                  Visit Pharmacy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {results && results.results.length === 0 && (
        <div className="no-results">
          <p>No results found for "{results.medicine}". Please try a different medicine name.</p>
        </div>
      )}
    </div>
  );
}

export default App;