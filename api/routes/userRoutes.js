const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const User = require('../models/userModel');
const { route } = require('./products');

router.post('/signup', (req, res, next) => {
  // chceck if a user already exists
  User.find({ email: req.body.email }).then((user) => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: 'User with that mail already exists',
      });
    } else {
      // hash the pass, if an error occurs send an error log
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const user = new User({
            _id: mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
          });
          user
            .save()
            .then((result) => {
              console.log(user);
              res.status(201).json({
                message: 'User created',
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: err,
              });
            });
        }
      });
    }
  });
});

router.delete('/:userId', (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .then((result) => {
      res.status(200).json({
        message: 'User deleted',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
