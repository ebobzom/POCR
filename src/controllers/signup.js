import express from 'express';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const enviromentVariables = require('dotenv').config().parsed;
import db from '../config/db';


const signupRouter = express.Router();

const  validation = [
    check('email').isEmail(),
    check('password').exists().isString()
]

const selectQuery = `registrationID, firstName, lastName,
otherName, dateOfBirth, dateCreated, 
dateLastModified, email,
gradeLevel, profileImageURL, gender,
mobileNumber, currentPage, descriptionOfJobRole,
isEnabled, state, mda, 
country, LGAID, roleID` 

signupRouter.post('/signup', validation, (req, res) => {

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
            bcrypt.hash(password, 10, (err, hash)=> {
                if(err){
                    return res.status(500).json({
                        success: false,
                        msg: err.message
                    });
                }

                const insertQuery = `UPDATE users SET password ='${hash}' WHERE email='${email}'`;
                db.query(insertQuery, (err, result) => {
                    if(err){
                        return res.status(500).json({
                            success: false,
                            msg: err.message
                        });
                    }

                    if(result.affectedRows > 0){
                        const dataToBeStored = {
                            firstName: result1[0].firstName,
                            lastName: result1[0].lastName,
                            otherName: result1[0].otherName,
                            registrationID: result1[0].registrationID,
                            email: result1[0].email,
                            isEnabled: result1[0].isEnabled,
                            roleID: result1[0].roleID  
                        }
                        jwt.sign(dataToBeStored, enviromentVariables.TOKEN_SECRET, { expiresIn: '24h' }, (err, tokenValue) => {
                            if(err){
                                return res.status(500).json({
                                    success: false,
                                    msg: err.message
                                });
                            }
                            return res.status(200).json({
                                success: true,
                                msg: 'user created successfully',
                                token: tokenValue
                            });
                        });
                      
                    }else{
                        return res.status(500).json({
                            success: false,
                            msg: 'An error occured'
                        });
                    }
                });
            });

        } else{
            return res.status(400).json({
                success: false,
                msg: 'Your are not yet invited to register on this platform'
            });
        }
    });

});

export default signupRouter;