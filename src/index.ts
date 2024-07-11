import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import routes from './routes/index';
import { AppDataSource } from './config/data-source';

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.use(express.json());
    app.use('/', routes);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    });

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.log("Database connection error:", error);
  });
