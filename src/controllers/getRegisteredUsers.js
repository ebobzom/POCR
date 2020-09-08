import express from 'express';
const enviromentVariables = require('dotenv').config().parsed;
import db from '../config/db';
import verifyToken from '../middleware/verifyToken';


const getRegisteredUsersRouter = express.Router();

const selectQuery = `registrationID, firstName, email, mobileNumber, gender, dateCreated` 

getRegisteredUsersRouter.get('/users', verifyToken, (req, res) => {

    const query = `SELECT ${selectQuery} from users`;
    db.query(query, (err, result1) => {
        if(err){
            return res.status(500).json({
                success: false,
                masg: err.message
            });
        }

        if(!req.decoded.roleID === 2){
            return res.status(400).json({
                success: false,
                masg: 'You are not an admin'
            });
        }
        
        if(result1.length > 0){
            
            return res.status(200).json({
                success: true,
                data: result1
            })
        } else{
            return res.status(200).json({
                success: true,
                msg: []
            });
        }
    });

});

export default getRegisteredUsersRouter;