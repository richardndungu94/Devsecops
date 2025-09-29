const express =require('express');
const router =express.Router();
const auth =require ('../middleware/authMiddleware');
const {register,login,getProfile} =require('../controllers/authcontroller');


router.post('/register',register);
router.post('/login',login);
//router.get('/me',auth,getProfile); 
router.get('/me',getProfile);//we have removed the authentication middleware

// Logout route (JWT logout is client-side)
router.post('/logout', (req, res) => {
	// On the client, just delete the token
	res.json({ msg: 'Logged out. Please delete your token on the client.' });
});

module.exports=router;