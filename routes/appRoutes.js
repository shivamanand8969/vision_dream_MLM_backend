import express from 'express';

const router=express.Router();

router.get('/',(req,res)=>{
    res.json("app gett")
})


export default router;