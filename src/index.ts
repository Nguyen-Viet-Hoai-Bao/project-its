// import express, { Request, Response, NextFunction } from 'express';
// import path from 'path';
// import i18next from 'i18next';
// import Backend from 'i18next-fs-backend';
// import middleware from 'i18next-http-middleware';
// import session from 'express-session';
// import flash from 'connect-flash';
// import router from './routes/index';
// import { AppDataSource } from './config/data-source';

// const app = express();

// i18next
//   .use(Backend)
//   .use(middleware.LanguageDetector)
//   .init({
//     fallbackLng: 'en',
//     backend: {
//       loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
//     },
//     interpolation: {
//       escapeValue: false,
//     },
//   });

// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// app.use(middleware.handle(i18next));

// app.use(session({
//   secret: process.env.SESSION_SECRET || 'defaultSecret',
//   resave: false,
//   saveUninitialized: true
// }));
// app.use(flash());

// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   next();
// });

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Database connected");

//     app.use(express.json());
//     app.use(express.urlencoded({ extended: true }));
//     app.use('/', router);

//     app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//       console.error('Error:', err);
//       res.status(500).send('Internal Server Error');
//     });

//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch(error => {
//     console.log("Database connection error:", error);
//   });

import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình thư mục public để chứa các file tĩnh
app.use(express.static(path.join(__dirname, '..', 'public')));

// Cấu hình multer để lưu trữ file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Route để phục vụ file index.html khi truy cập vào đường dẫn gốc
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Route để xử lý upload file
app.post('/upload', upload.single('audioFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded: <a href="/uploads/${req.file.filename}">Listen to the file</a>`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
