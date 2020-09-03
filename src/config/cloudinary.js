import cloudinary from 'cloudinary';

const cloudinaryV2 = cloudinary.v2;
const enviromentVariables = require('dotenv').config().parsed;

cloudinaryV2.config({
    cloud_name: enviromentVariables.CLOUDINARY_CLOUD_NAME,
    api_key: enviromentVariables.CLOUDINARY_API_KEY,
    api_secret: enviromentVariables.CLOUDINARY_API_SECRET
});

export default cloudinaryV2;