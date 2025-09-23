/*
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = await User.create({ email, password });
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }



};



exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};
*/


//The Vulnerable code

const jwt = require('jsonwebtoken');
const User = require('../models/User');

//here  is hardcoded secret instead of using environment variables
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, 'insecure_secret', { expiresIn: '1d' });
};

exports.register = async (req, res) => {
  const {username,phoneNumber, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // here we store password in plain text without hashing
    user = new User({ username,phoneNumber,email, password });
    await user.save();


    const token = generateToken(user);

    //then espose the sensitive information in the respnse header
    res.status(201).json({ token,user });
  } catch (err) {
    //expose the raw error to client
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // here i compared the plain text passwords without hashing
    const isMatch = user.password === password;
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    
    const token = generateToken(user);
//leak the full user object including password

    res.status(200).json({ msg:"Login Successful",token,user });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }


};


exports.getProfile = async (req, res) => {
  try{
    // no authentication middleware used
  const user = await User.findById(req.query.id);


  res.json(user);//Sends full user document,pass,Id 
  } catch (err){
    // leaked the backend error details
    res.status(500).json({msg:err.message})
  }
};