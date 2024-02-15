const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const API_KEY = process.env.REACT_APP_RAPID_API_KEY;

router.get('/api/airport-search', async (req, res) => {
  try {
    const { location } = req.query;
    const response = await axios.get('https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchAirport', {
      params: { query: location },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    });

    let airports = response.data.data;
    let randomAirport = airports[Math.floor(Math.random() * airports.length)];
    
    res.json(randomAirport);
  } catch (error) {
    res.status(500).json({ error: error.message || 'An error occurred' });
  }
});

router.get('/api/restaurant-search', async (req, res) => {
  try {
    const { location} = req.query;

    // First API call to get location ID
    const locationResponse = await axios.get('https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchLocation', {
      params: { query: location },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    });

    const locationId = locationResponse.data.data[0]?.locationId;

    if (!locationId) {
      res.status(400).json({ error: 'Location ID not found' });
      return;
    }

    // Second API call to get restaurants based on location ID
    const restaurantsResponse = await axios.get('https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants', {
      params: { locationId: locationId },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    });

    const restaurantsData = restaurantsResponse.data.data;
    res.json(restaurantsData);
  } catch (error) {
    res.status(500).json({ error: error.message || 'An error occurred' });
  }
});

router.get('/api/hotels-search', async (req, res) => {
  try {
    const { geoId, checkIn, checkOut } = req.query;

    const response = await axios.get('https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels', {
      params: {
        geoId,
        checkIn,
        checkOut,
        pageNumber: '1',
        currencyCode: 'USD'
      },
      headers: {
        'X-RapidAPI-Key' : API_KEY,
        'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    });

    const resultsData = response.data.data.data;
    res.json(resultsData);
  } catch (error) {
    res.status(500).json({ error: error.message || 'An error occurred' });
  }
});


module.exports = router;
