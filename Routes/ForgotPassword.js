const express = require('express');
const router = express.Router();
const User = require('../Models/user'); 
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//to request a password reset
router.post('/forgot-password', async (req, res) => {
    try {
      const { Email } = req.body;
      console.log(Email);
      const user = await User.findOne({ email: Email });
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const token = jwt.sign(
        { firstname: user.firstname, userId: user._id,email:user.email },
        process.env.JWT_KEY, 
        { expiresIn: '1h' } 
    );
  
      //send an email with the reset link
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
        to: user.email,
        subject: 'Password Reset Request',
        text: `You are receiving this because you  have requested the reset of the password for your account.\n\n`
          + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
          + `https://voyagebuddy.net/reset-password/${user._id}/${encodeURIComponent(token)}\n\n`
          + `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Failed to send reset email' });
        }
        res.status(200).json({ message: 'Reset email sent' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
});

//reset the password
router.post('/reset-password/:id/:token', async (req, res) => {
    try {
      const {  id, token } = req.params;

      //console.log('Received token:', token);
      const { newPassword } = req.body;
  
      console.log(newPassword)
      console.log(id)

     
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      //console.log('Decoded:', decoded);
      if (!decoded) {
        return res.status(400).json({ message: 'Error with token' });
      }
        
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await User.findByIdAndUpdate(id, { password: hashedPassword });
  
      //send an email confirmation
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sohaibsipra869@gmail.com',
          pass: 'hfzr tmpg meug yskb'
        }
      });
  
      const confirmationMailOptions = {
        from: 'sohaibsipra869@gmail.com',
        to: decoded.email, 
        subject: 'Password Reset Successful',
        text: 'Your password has been successfully reset.',
      };
  
      transporter.sendMail(confirmationMailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Failed to send email' });
        }
        console.log('Email sent: ' + info.response);
      });
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  

  module.exports = router;