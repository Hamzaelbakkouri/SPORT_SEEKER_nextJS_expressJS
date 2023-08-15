import connectDB from './config/db';
import { notFound, errorHandler } from './middleWare/errorMiddleware';
import userRoutes from './routes/userRoutes'
import postRoutes from './routes/postRoutes';
import salleRoutes from './routes/salleRoutes';
import sportRoutes from './routes/sportRoutes';
import cityRoutes from './routes/cityRoutes';
import saveRoutes from './routes/saveRoutes';
import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';

const port = process.env.PORT || 5000;
dotenv.config();

const app = express()

app.use(express.json())
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/salle', salleRoutes);
app.use('/api/sport', sportRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/save', saveRoutes);
app.get('/', (req: any, res: any) => res.send('rah nadiiii'))
app.use(notFound)
app.use(errorHandler)

connectDB()
    .then(() => app.listen(port, () => console.log(`server is running on port: ${port} 🐊🐊`)))
    .catch((err) => console.log(err))

