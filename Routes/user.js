const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

//signup
router.post('/signup', async (req, res, next) => {
    try {
        console.log('hi')
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            dateOfBirth: req.body.dateOfBirth
        });
        const result = await user.save();
        return res.status(201).json({
            message: 'User created',
            result: result
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}
);

//login
router.post('/signin', async (req, res, next) => {
    try {
        const { firstname, password } = req.body;
        console.log(firstname, password )
        const user = await User.findOne({ email: firstname });
        
        if (!user || !(bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }

        if(!user.verified){
            return res.status(401).json({
                message: 'User not verified'
            });
        }
        
        console.log("jwt secret key: ",process.env.JWT_KEY )
      
        const token = jwt.sign(
            { firstname: user.firstname, userId: user._id,email:user.email },
            process.env.JWT_KEY, 
            { expiresIn: '1h' } 
        );

       
        return res.status(200).json({
            message: 'Authentication successful',
            token: token
        });

    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
});

module.exports = router;

