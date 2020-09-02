import adminUploadUsers from '../controllers/adminUploadUsers';

const baseURL = '/api/v1'

function routes(app){
    app.use(baseURL, adminUploadUsers);
}

export default routes;