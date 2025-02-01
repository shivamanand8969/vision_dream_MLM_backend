import sequelize from "../utilities/database.js";
import User from "./User.js";


sequelize.sync({force:false}).then(()=>{
    console.log("Database Synchronized SuccessFully");
}).catch(err=>{
    console.error("Error Synchronizing database",err)
})

export {User};