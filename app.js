import express from 'express';
import cors from 'cors';
import hpp from 'hpp';
import xss from 'xss-clean';
import compression from 'compression';
import routes from './src/routes/routes';
import fileupload from 'express-fileupload';
const enviromentVariables = require('dotenv').config().parsed;
const app = express();
const port = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(hpp());
app.use(xss());
app.use(compression());
app.use(fileupload({ useTempFiles: true }));
// All routes
routes(app);

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});

