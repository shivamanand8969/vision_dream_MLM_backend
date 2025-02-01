import { validationErrorHandler } from "../../helpers/validation-error-handler.js"
import { User } from "../../model/index.js";

export const createUser=async(req,res,next)=>{
    validationErrorHandler(req,next); 
   try {
    const {name,phone,email,referralKey,createid,password}=req.body;
    let existingUser=await User.findOne({where:{phone}});
    if(existingUser){
        const error=new Error("User Already Exist with this Phone Number");
        error.statusCode=403;
        return next(error);
    }
    let userDetails=await User.create({
        name,phone,email,referralKey,createid,password  
    });

    return res.status(201).json({
        userDetails,
        message:'User Created SuccsseFully'
    })
   
   } catch (error) {
      if(!error.statusCode){
        error.statusCode=500;

      }
      return next(error);
   } 
}

export const getUserDetails=async (req,res,next)=>{
    validationErrorHandler(req,next);

    try{
       let data=await User.findAll();
       return res.json(data);
    }
    catch(err){
       console.log("Error",err);
    }
}