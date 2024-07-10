// import express, {Request, Response} from 'express';
// import path from 'path';

// const app = express();

// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// app.use(express.json());

// app.get('/', (req: Request, res: Response) => {
//     res.render('index', { title: 'Welcome', message: 'Hello from Pug with TypeScript!' });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


import express from 'express';
import authorRouter from './routes/Author.routes';
import { AppDataSource } from './config/data-source';

const app = express();

app.use(express.json());

AppDataSource.initialize().then(() => {
    console.log("Database connected");

    app.use('/api', authorRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.log("Database connection error:", error);
});

