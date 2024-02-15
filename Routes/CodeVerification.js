const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../Models/user');
router.post('/send-verification-code', async (req, res) => {
    try {
        const { useremail } = req.body;
        console.log("user email: ", useremail);
        const verificationCode = Math.floor(1000 + Math.random() * 9000);

        var transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            auth: {
                user: 'admin@voyagebuddy.net',
                pass: 'West3700$#'
            }
        });

        const mailOptions = {
            from: 'admin@voyagebuddy.net',
            to: useremail,
            subject: 'Verification Code',
            text: `Your verification code is: ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);
        console.log("code:", verificationCode)
        res.status(200).json({
            message: 'Verification code sent successfully',
            verificationCode: verificationCode,
        });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
});

router.put('/verify-user', async (req, res) => {
    try {

        const { useremail } = req.body;
        
        const user = await User.findOne({ email: useremail });
        user.verified = true;
        await user.save();
        res.status(200).json({
            message: 'User verified',
        });

    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
});


module.exports = router;