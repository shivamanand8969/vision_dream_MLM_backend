import fs from 'fs';
import { username,password,host,port,db_name,path } from './constants.js';
import { Sequelize } from 'sequelize';

const sequelize=new Sequelize(db_name,username,password,{
    host,
    port,
    dialect:'mysql',
    logging:false
});
export default sequelize;