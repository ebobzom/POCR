import express from 'express';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const enviromentVariables = require('dotenv').config().parsed;
import db from '../config/db';


const loginRouter = express.Router();

const  validation = [
    check('email').isEmail(),
    check('password').exists().isString()
]

const selectQuery = `registrationID, firstName, lastName,
otherName, dateOfBirth, dateCreated, 
dateLastModified, email, password,
gradeLevel, profileImageURL, gender,
mobileNumber, currentPage, descriptionOfJobRole,
isEnabled, state, mda, 
country, LGAID, roleID` 

loginRouter.post('/login', validation, (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({
            status: 'error',
            error: errors.array()
        });
    }

    const {
        email, password
    } = req.body;

    const query = `SELECT ${selectQuery} from users WHERE email = '${email}'`;
    db.query(query, (err, result1) => {
        if(err){
            return res.status(500).json({
                success: false,
                masg: err.message
            });
        }
        
        if(result1.length > 0){
            bcrypt.compare(password, result1[0].password,  (err, success)=> {
                if(err){
                    return res.status(500).json({
                        success: false,
                        msg: err.message
                    });
                }

                if(!success){
                    return res.status(500).json({
                        success: false,
                        msg: 'Invalid email or password'
                    });
                }

                const dataToBeStored = {
                    firstName: result1[0].firstName,
                    lastName: result1[0].lastName,
                    otherName: result1[0].otherName,
                    registrationID: result1[0].registrationID,
                    email: result1[0].email,
                    isEnabled: result1[0].isEnabled,
                    roleID: result1[0].roleID  
                }
                jwt.sign(dataToBeStored, process.env.TOKEN_SECRET, { expiresIn: '24h' }, (err, tokenValue) => {
                    if(err){
                        return res.status(500).json({
                            success: false,
                            msg: err.message
                        });
                    }
                    return res.status(200).json({
                        success: true,
                        msg: 'login successfull',
                        token: tokenValue
                    });
                });
            });

        } else{
            return res.status(400).json({
                success: false,
                msg: 'Authentication error, Invalid email or password, please register'
            });
        }
    });

});

export default loginRouter;