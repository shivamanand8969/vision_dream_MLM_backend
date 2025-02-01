import express from 'express';
import { createUser, getUserDetails } from '../controllers/auth/users.js';

const router=express.Router();

router.post('/user/create',createUser)
router.get('/userdetails',getUserDetails)


export default router;