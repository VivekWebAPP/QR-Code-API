import express from 'express';
import ConnectToDB from './db.js';
import dotenv from 'dotenv';
import router from './routes/qrAPIroute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

ConnectToDB();

app.use('/api',router);

app.get('/', (req, res) => {
    res.send({ welcome: "Welcome To XYZ - Ecommerce" });
});

app.listen(port, () => {
    console.log(`Server Is Running At Port http://localhost:5000/`);
});

