import express from 'express';
import ConnectToDB from './db.js';
import dotenv from 'dotenv';
import router from './routes/qrAPIroute.js';

const app = express();
const port = 5000;
dotenv.config();

ConnectToDB();

app.use('/api',router);

app.get('/', (req, res) => {
    res.send({ welcome: "Welcome To XYZ - Ecommerce" });
});

app.listen(port, () => {
    console.log(`Server Is Running At Port http://localhost:5000/`);
});

