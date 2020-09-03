/**
 * LOGIC
 * 1) fetch user image url base on user ID.
 * 2) if image url is nit null insert new image
 * 3) else delete old image from cloudinary and insert new image url in database
 */

import path from 'path';
import del from 'del';
import express from 'express';
import { validationResult } from 'express-validator';
import verifyToken from '../middleware/verifyToken';
import cloudinary from '../config/cloudinary'; 
import db from '../config/db';
const dir = path.resolve(__dirname, '../../tmp');
const userImageUpload = express.Router();

userImageUpload.post('/image', verifyToken, (req, res) => {
    const userImage = req.files.image;
    const registrationID = req.decoded.registrationID;

    function uploadImage(imagePath){
        cloudinary.uploader.upload(imagePath, (err, cloudinaryResult) => {
            if(err){
                logError(err);
                return res.status(500).json({
                    success: false,
                    msg: err.msg
                });
            }
            const { secure_url, public_id } = cloudinaryResult;
    
            // insert into db
            const queryString = `UPDATE users SET profileImageURL='${secure_url}', profileImagePublicID='${public_id}' WHERE registrationID='${registrationID}'`
            db.query(queryString, (dbErr, result) => {
                if(dbErr){
                    return res.status(500).json({
                        success: false,
                        msg: dbErr.message
                    });
                    
                }
    
                if(result.affectedRows > 0){
                    // delete tmp folder
                    (async () => {
                        try {
                            await del(dir);
                    
                            console.log(`${dir} is deleted!`);
                        } catch (err) {
                            console.error(`Error while deleting ${dir}.`);
                        }
                    })();
                    return res.status(201).json({
                        success: true,
                        msg: `profile image URL is ${secure_url}`
                    });
                }
    
                return res.status(500).json({
                    status: "error",
                    error: 'An error occured'
                });
            })
    
        });
    }

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({
            status: "error",
            error: errors.array()
        });
    }
    // fetch user from DB
    const userQuery = `SELECT profileImageURL, profileImagePublicID FROM users WHERE registrationID='${registrationID}'`;
    db.query(userQuery, (err, result) => {
        if(err){

            return res.status(500).json({
                success: false,
                msg: err.message
            });
        }

        if(!result[0].registrationID){
            uploadImage(userImage.tempFilePath);
        }else{
            cloudinary.uploader.destroy(result[0].registrationID, { invalidate: true}, (err, returneData) => {
                if(err){
                    return res.status(500).json({
                        success: true,
                        msg: err.message
                    });
                }

                if(returneData.result === 'ok'){
                    uploadImage(userImage.tempFilePath);
                    // delete tmp folder
                    (async () => {
                        try {
                            await del(dir);
                    
                            console.log(`${dir} is deleted!`);
                        } catch (err) {
                            console.error(`Error while deleting ${dir}.`);
                        }
                    })();
                } else{
                    return res.status(401).json({
                        status: 'error',
                        error: 'An error occurred'
                    });
                }
            })
        }
    });

    
});

export default userImageUpload;
