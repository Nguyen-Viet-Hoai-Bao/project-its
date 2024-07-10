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


// import express from 'express';
// import tutorial from './routes/tutorial'; 

// const app = express();

// // Sử dụng route
// app.use('/tutorial', tutorial);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });