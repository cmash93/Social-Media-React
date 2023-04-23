import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import AuthRoutes from './routes/AuthRoutes';
import ChatRoutes from './routes/ChatRoutes';
import MessageRoutes from './routes/MessageRoutes';
import PostRoutes from './routes/PostRoutes';
import UploadRoutes from './routes/UploadRoutes';
import UserRoutes from './routes/UserRoutes';

const CONNECTION = process.env.MONGODB_CONNECTION;
const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }));

app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use(cors());

app.use(express.static('public'));

app.use('/images', express.static('images'));

dotenv.config();

mongoose
.connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => app.listen(PORT, () => console.log(`Listening at port ${PORT}`)))
.catch((error) => console.log(`${error} did not connect`));

app.use('/auth', AuthRoutes);
app.use('/chat', ChatRoutes);
app.use('/message', MessageRoutes);
app.use('/post', PostRoutes);
app.use('/upload', UploadRoutes);
app.use('/user', UserRoutes);