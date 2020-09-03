import express from 'express';
import verifyToken from '../middleware/verifyToken';
import db from '../config/db';


const userDetailsRouter = express.Router();

const selectQuery = `registrationID, firstName, lastName,
otherName, dateOfBirth, dateCreated, 
dateLastModified, email,
gradeLevel, profileImageURL, gender,
mobileNumber, currentPage, descriptionOfJobRole,
isEnabled, state, mda, 
country, LGAID, roleID` 

userDetailsRouter.get('/user', verifyToken, (req, res) => {

    const query = `SELECT ${selectQuery} from users WHERE email = '${req.decoded.email}'`;
    db.query(query, (err, result1) => {
        if(err){
            return res.status(500).json({
                success: false,
                masg: err.message
            });
        }
        
        if(result1.length > 0){

            // fetch all necessarry data
            const fetchRole = `SELECT roleID, role FROM role`;
            const fetchGradeLevel = `SELECT GradeLevelID, GradeLevelDescription FROM gradeLevel`;
            const fetchStates = `SELECT StateID, State FROM states`;
            const fetchLGA = `SELECT LGAID, StateID, LGA FROM LGA`;
            const fetchCountries = `SELECT CountryID, Country FROM countries`;
            const fetchMDA = `SELECT MDAID, MDAName FROM mda`;

            function errorHandling(err){
                return res.status(500).json({
                    success: false,
                    msg: err.message
                });
            }
            db.query(fetchRole, (err, Role) => {
                if(err){
                    errorHandling(err);
                }
                db.query(fetchGradeLevel, (err, GradeLevel) => {
                    if(err){
                        errorHandling(err)
                    }

                    db.query(fetchStates, (err, States) => {
                        if(err){
                            errorHandling(err)
                        }

                        db.query(fetchLGA, (err, LGA) => {
                            if(err){
                                errorHandling(err)
                            }

                            db.query(fetchMDA, (err, MDA) => {
                                if(err){
                                    errorHandling(err)
                                }

                                db.query(fetchCountries, (err, Countries) => {
                                    if(err){
                                        errorHandling(errs)
                                    }

                                    res.status(200).json({
                                        success: true,
                                        data: {
                                            userDetails: result1[0],
                                            role: Role,
                                            gradeLevel: GradeLevel,
                                            states: States,
                                            LGA: LGA,
                                            MDA: MDA,
                                            countries: Countries
                                        }

                                    });
                                });
                            });
                        });
                    });
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

export default userDetailsRouter;