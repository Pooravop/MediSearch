const express = require('express');
const cors = require('cors');
const { scrapePharmacyPrices } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock pharmacy data for demonstration
const mockPharmacies = [
  { name: 'PharmEasy', baseUrl: 'https://pharmeasy.in' },
  { name: 'Netmeds', baseUrl: 'https://netmeds.com' },
  { name: 'Apollo Pharmacy', baseUrl: 'https://apollopharmacy.in' },
  { name: 'Medlife', baseUrl: 'https://medlife.com' },
  { name: '1mg', baseUrl: 'https://1mg.com' }
];

// Route to search medicine prices
app.get('/api/search/:medicine', async (req, res) => {
  const { medicine } = req.params;
  
  try {
    console.log(`Searching for medicine: ${medicine}`);
    
    // Simulate scraping delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock prices for demonstration
    const prices = mockPharmacies.map(pharmacy => ({
      pharmacy: pharmacy.name,
      price: (Math.random() * 500 + 50).toFixed(2),
      availability: Math.random() > 0.2 ? 'In Stock' : 'Out of Stock',
      discount: Math.floor(Math.random() * 30) + 5,
      url: pharmacy.baseUrl
    }));
    
    // Sort by price
    prices.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    
    res.json({
      medicine,
      results: prices,
      bestPrice: prices[0].price,
      savings: (parseFloat(prices[prices.length - 1].price) - parseFloat(prices[0].price)).toFixed(2)
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search medicine prices' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MediScout API is running' });
});

app.listen(PORT, () => {
  console.log(`MediScout backend running on port ${PORT}`);
});