import jwt from 'jsonwebtoken';
const enviromentVariables = require('dotenv').config().parsed;

function verifyToken(req, res, next){
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.body.token || req.headers['token'];
    let checkBearer = 'Bearer '

    if(token){
        if(token.startsWith(checkBearer)){
            token = token.slice(checkBearer.length, token.length);
        }
        jwt.verify(token, enviromentVariables.TOKEN_SECRET, (err, decoded) => {
            if(err){
                return res.status(400).json({
                    sucess: false,
                    msg: 'Failed to Authenticate'
                });
            }else{
                req.decoded = decoded;
                next();
            }
        })
    }else{
        return res.status(400).json({
            sucess: false,
            msg: 'No token provided'
        });
    }
}
export default verifyToken;