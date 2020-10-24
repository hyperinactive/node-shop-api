const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.signup = (req, res, next) => {
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
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user.length < 1) {
        return res.status(404).json({
          message: 'Authentication failed',
        });
      } else {
        // hash the provided pass and compare the hashes
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          // this err is made when the pass doesn't match
          if (err) {
            return res.status(404).json({
              message: 'Authentication failed',
            });
          }
          // compare successful
          if (result) {
            /**
             * first arg is the payload (don't provide it with anything valuable)
             * second is the secret key
             * third is the options arg, here I simply want it to just expire in an hour
             * fourth would be a callback to provide us with a token, but it can be done like this (synchronous though)
             * const token = jwt.sign(...)
             *
             * NOTE: the token is not ENCRYPTED, only ENCODED (useful~ jwt.io decode)
             */
            const token = jwt.sign(
              {
                email: user.email,
                userId: user._id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: '1h',
              }
            );
            return res.status(200).json({
              message: 'Authentication successful',
              token: token,
            });
          }
          res.status(404).json({
            message: 'Authentication failed, incorrect password',
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete = (req, res, next) => {
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
};
