const express = require('express');
const router = express.Router();
const Trip = require('../Models/Trip');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();
const API_KEY = process.env.REACT_APP_RAPID_API_KEY;

//save a trip for a user
router.post('/save-trip', async (req, res) => {
    console.log("save trip")
    try {
        const { location, checkIn, checkOut, restaurants, hotels, airports } = req.body;

        const newTrip = new Trip({
            location: location,
            checkIn: checkIn,
            checkOut: checkOut,
            restaurants: restaurants,
            hotels: hotels,
            airports: airports,

        });
        await newTrip.save();
        return res.status(200).json({'message':"new trip added"});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}
);

router.get('/get-api-key', async (req, res) => {
    console.log("send_API_KEY", API_KEY);
    try {
        return res.json({
            API_KEY: API_KEY,
            Success: true,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal Server Error',
        });
    }
}
);


module.exports = router;