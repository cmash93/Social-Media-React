import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import AuthRoutes from './routes/AuthRoutes.js';
import ChatRoutes from './routes/ChatRoutes.js';
import MessageRoutes from './routes/MessageRoutes.js';
import PostRoutes from './routes/PostRoutes.js';
import UploadRoutes from './routes/UploadRoutes.js';
import UserRoutes from './routes/UserRoutes.js';

import db from './config/connection.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }));

app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use(cors());

app.use(express.static('public'));

app.use('/images', express.static('images'));

dotenv.config();

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port :${PORT}!`);
    })
});

app.use('/auth', AuthRoutes);
app.use('/chat', ChatRoutes);
app.use('/message', MessageRoutes);
app.use('/post', PostRoutes);
app.use('/upload', UploadRoutes);
app.use('/user', UserRoutes);