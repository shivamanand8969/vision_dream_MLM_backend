import { DataTypes } from "sequelize";
import sequelize from "../utilities/database.js";

const User=sequelize.define('User',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    referralKey:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    createid:{
        type:DataTypes.INTEGER,
        allowNull:true,
        default:null
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

// User.beforeValidate(async (user)=>{
//     if(!user.referralKey){
//          const latestReferralUser=await User.findOne({
//             order:[["createAt","DESC"]]
//          })

//          let newReferralKey="MG02334";
//          if(latestReferralUser){
//             latestReferralUser=parseInt( latestReferralUser.referralKey.substring(8));
//             newReferralKey="MG02334"+ (latestReferralUser+1);
//         }
//         user.referralKey=newReferralKey;
//     }
// })

export default User;

