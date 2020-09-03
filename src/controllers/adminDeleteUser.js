import express from 'express';
import db from '../config/db';
import verifyToken from '../middleware/verifyToken';
import { validationResult }from 'express-validator';
import { check } from 'express-validator';

const deleteUserRouter = express.Router();

let deleteCourseValidation = [
    check('registrationID', 'parameter must be an istring').exists().isString()
]

deleteUserRouter.delete('/users/:registrationID', deleteCourseValidation, verifyToken, (req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'error',
            msg: errors.array()
        });
    }

    const {
        registrationID
    } = req.params;

    // TODO: put logic to check for admin user
    if( req.decoded.roleID === 2){
        const deleteQuery = `DELETE FROM users WHERE registrationID='${registrationID}'`;

        db.query(deleteQuery, (err, result) => {
            if(err){
                return res.status(500).json({
                    success: false,
                    msg: err.message
                });
            }

            if(result.affectedRows > 0){
                return res.status(200).json({
                    success: true,
                    msg: 'user deleted successfully'
                });
            }else{
                return res.status(500).json({
                    success: false,
                    msg: 'delete failed'
                });
            }
        });
    }else{
        return res.status(400).json({
            success: false,
            msg: 'authentication error, user not an admin'
        });
    }

});
export default deleteUserRouter;