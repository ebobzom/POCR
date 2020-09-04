import express from 'express';
import validator from 'validator';
import verifyToken from '../middleware/verifyToken';
import db from '../config/db';
import { v4 as uuid4 } from 'uuid';
import { check, validationResult } from 'express-validator';

const adminUploadUsers = express.Router();

const validation = [
    check('users').isArray()
]

adminUploadUsers.post('/admin/uploadUsers', validation, verifyToken, (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({
            status: 'error',
            error: errors.array()
        });
    }

    const userData = req.body.users;
    // check if user is admin

    if(req.decoded.roleID != 2){
        return res.status(400).json({
            success: false,
            msg: 'User is not an admin'
        });
    }
    let getEmailsQuery = `SELECT email from users`;
    db.query(getEmailsQuery, (err, result) => {
        if(err){
            return res.status(500).json({
                success: false,
                msg: err.message
            });
        }

        let dbEmailsArray = result.map(e => e.email);

        // remove any duplicates andvalidate emails to avoid db errors for unique emails and sending notification to invalida users
        const filteredUsers = userData.filter(obj => dbEmailsArray.indexOf(obj.email) === -1 && validator.isEmail(obj.email));
        if(filteredUsers.length <= 0){
            return res.status(200).json({
                success: true,
                msg: 'All users already in database'
            });
        }
        const query = 'INSERT INTO users(registrationID, email, firstName, mda, mobileNumber) VALUES (?)'
        const convertedUsersIntoArrayOfArrays = filteredUsers.map((value) => {
            let userID = uuid4().split('-').join('');
            return [userID, value.firstName, value.mda, value.mobileNumber];
        });

        let count = 0;
        convertedUsersIntoArrayOfArrays.forEach(arr => {
            
            db.query(query, [arr], (err) => {
                if(err){
                    fails.push(arr)
                    return;
                }
                return;
            }); 
            count++; 
        });

        return res.status(200).json({
            success: true,
            data: {
                successfullInserts: count,
                msg: 'users uploaded successfully'
            }
        });
        
    });

    

});

export default adminUploadUsers;