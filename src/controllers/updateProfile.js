import express from 'express';
import { check, validationResult } from 'express-validator';
import verifyToken from '../middleware/verifyToken';
const enviromentVariables = require('dotenv').config().parsed;
import db from '../config/db';


const updateProfileRouter = express.Router();

const  validation = [
    check('firstName').exists().isString(),
    check('lastName').exists().isString(),
    check('otherName').exists().isString(),
    check('gradeLevel').exists().isString(),
    check('descriptionOfJobRole').exists().isString(),
    check('gender').exists().isString(),
    check('state').exists().isString(),
    check('country').exists().isString(),
    check('mda').exists().isString(),
    check('LGAID').exists().isString(),
    check('dateOfBirth').isDate()
]; 

updateProfileRouter.put('/user', verifyToken, validation, (req, res) => {

    function formatDate(val){
        let dateArr = val.split('/');
        return [dateArr[2], dateArr[1], dateArr[0]];
    }

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({
            status: 'error',
            error: errors.array()
        });
    }

    const {
        firstName, lastName,otherName, dateOfBirth, gradeLevel, 
        gender, mobileNumber, currentPage, descriptionOfJobRole,
        state, mda, country, LGAID
    } = req.body;


    const insertQuery = `UPDATE users SET firstName = '${firstName}', lastName = '${lastName}', 
    otherName = '${otherName}', dateOfBirth = '${dateOfBirth}', gradeLevel = '${gradeLevel}', 
    gender = '${gender}', mobileNumber = '${mobileNumber}', currentPage = '${currentPage}', descriptionOfJobRole = '${descriptionOfJobRole}',
    state = '${state}', mda = '${mda}', country = '${country}', LGAID = '${LGAID}', dateLastModified = '${formatDate(new Date().toLocaleString().split(',')[0])}'
    WHERE registrationID='${req.decoded.registrationID}'`;
    db.query(insertQuery, (err, result) => {
        if(err){
            return res.status(500).json({
                success: false,
                msg: err.message
            });
        }

        if(result.affectedRows > 0){
            return res.status(201).json({
                success: true,
                msg: 'profile updated successfully'
            });
            
        }else{
            return res.status(500).json({
                success: false,
                msg: 'An error occured'
            });
        }
    });

});

export default updateProfileRouter;