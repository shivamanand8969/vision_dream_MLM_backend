import express from 'express';
import { createUser } from '../controllers/auth/users.js';

const router=express.Router();

router.post('/user/create',createUser)


export default router;