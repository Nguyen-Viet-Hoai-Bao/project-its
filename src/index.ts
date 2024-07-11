// import express, { Request, Response } from 'express';
// import path from 'path';
// import router from './routes/index';

// const app = express();

// app.set('view engine', 'pug'); // Sử dụng Pug làm view engine
// app.set('views', path.join(__dirname, 'views')); // Đường dẫn đến thư mục chứa các file Pug

// app.use(express.json());
// app.use('/', router); // Sử dụng router chính của bạn tại đây

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import router from './routes/index';
import { AppDataSource } from './config/data-source';

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.use(express.json());
    app.use('/', router);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.log("Database connection error:", error);
  });
