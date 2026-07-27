import express from 'express'
import {register,login,logout} from '../controller/authController.js'
import {protect} from'../middleware/authMiddleware.js'

const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);

router.get('/me',protect,(req,res)=>{
    res.status(200).json({message:"You are logged in",user:req.user});
})
export default router;