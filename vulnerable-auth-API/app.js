/*
const express =require ('express');
const mongoose =require ('mongoose');
const dotenv =require ('dotenv');
const authRoutes =require('./routes/authRoutes');
//add libraries api

dotenv.config(); //loads environment variables,reads env files
const app =express();//craetes app

app.use(express.json()); //parse incoming JSON to help handle payloads like email and password
app.use('/api/auth',authRoutes);//Registers Routes i.e /api/auth

//connects app to mongo db using URI from.env
mongoose.connect(process.env.MONGO_URI)

//starts server
.then(()=>{
    app.listen(process.env.PORT,()=>
        console.log(`server running on PORT ${process.env.PORT}`)
);

})

.catch(err => console.error(err));
*/


const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');            // Added CORS
const authRoutes = require('./routes/authRoutes');

dotenv.config(); // Load environment variables from .env

const app = express(); // Create Express app

// Middleware
app.use(express.json()); // Parse incoming JSON
app.use(cors({            // Enable CORS
    origin: "http://localhost:5173"   // Replace with your frontend URL
}));

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');

        // Start server after DB connection
        app.listen(process.env.PORT, () => 
            console.log(`Server running on PORT ${process.env.PORT}`)
        );
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
