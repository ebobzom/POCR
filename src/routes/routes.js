import adminUploadUsers from '../controllers/adminUploadUsers';
import adminDeleteUser from '../controllers/adminDeleteUser';
import signupRouter from '../controllers/signup';
import loginRouter from '../controllers/login';
import getUserDetailsRouter from '../controllers/getUserDetails';
import userProfileImageUpload from '../controllers/uploadProfilePicture';

const baseURL = '/api/v1'

function routes(app){
    app.use(baseURL, adminUploadUsers);
    app.use(baseURL, adminDeleteUser);
    app.use(baseURL, signupRouter);
    app.use(baseURL, loginRouter);
    app.use(baseURL, getUserDetailsRouter);
    app.use(baseURL, userProfileImageUpload);
}

export default routes;