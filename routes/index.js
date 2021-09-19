const { query } = require('express');
var express = require('express');
var router = express.Router();
var restaurants = require('../model/restaurants.model')
var users = require('../model/users.model')
var jwt = require("jsonwebtoken")
var auth = require('../authentication/auth')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/restaurant', auth, async (req, res) => {
  console.log(req.query.searchText)
  try {
    let query = {}
    if (req.query.searchText && req.query.searchText.length > 3) {
      query = { $or : [{name:{'$regex' : req.query.searchText, '$options' : 'i'}}, {address:{'$regex' : req.query.searchText, '$options' : 'i'}}, {cuisines:{ $elemMatch: {'$regex' : req.query.searchText, '$options' : 'i'}}} ]}
      
    }
    let val = await restaurants.find(query)
    res.json(val)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }
    const oldUser = await users.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const user = await users.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: password,
    });
    const token = jwt.sign(
      { user_id: user._id, email },
      "Test",
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await users.findOne({ email });
    if (user && password) {
      const token = jwt.sign(
        { user_id: user._id, email },
        "Test",
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
