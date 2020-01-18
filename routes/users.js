const config = require('config');
const _ = require('lodash');

const {User, validate} = require('../model/user');
const { hrUser } = require('../model/hruser');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(500).send(error.details[0].message);

  let user = await User.findOne({ Aadhar: req.body.Aadhar });
  if (user) return res.status(400).send('User already registered.');
  
  user = new User(req.body)
  await user.save();
  res.send(user);  
});

router.put('/update', async (req, res) => {
  let user = await User.findOneAndUpdate({ Aadhar: req.body.Aadhar }, { $set: req.body }, { "upsert": false,"new":true })
  res.send(user)
});

//DASHBOARD VALUES
router.get('/:filterID/:value', async (req, res) => {
  let event = {}
  filterID = req.params.filterID
  event[filterID] = req.params.value;
  let users = await User.find(event);
  res.status(200).send(users)
});

router.post('/login', async (req, res) => {
  let user = await hrUser.findOne({ name: req.body.Name, password: req.body.Password });
  if (user)
    return res.send({ "message": "user logged in" ,"token":"123456"});
  else
    return res.status(400).send({ "message": 'User does not exists.' });
});

router.get('/all', async (req, res) => {
  let users = await User.find();
  res.status(200).send(users)
});

router.post('/delete', async (req, res) => {
  let users = await User.findOneAndDelete({ Aadhar: req.body.Aadhar });
  let allUser = await User.find();
  res.status(200).send(allUser)
});

router.get('/:SortID', async (req, res) => {
  let event = {}
  SortID = req.params.SortID;
  event[SortID] = 1;
  const user = User.find({}, null, { sort: event }, function (err, users) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    console.log(users);
    res.status(200).send(users);
  });
});

module.exports = router;
