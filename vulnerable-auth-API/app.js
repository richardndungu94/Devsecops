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
