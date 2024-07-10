import express, { Request, Response, NextFunction } from "express";
import { AppDataSource } from '../config/data-source';
import { Author } from '../entity/Author.entity';

const app = express();
const router = express.Router();

// Khởi tạo kết nối cơ sở dữ liệu
AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected");

    // Route trang chủ
    router.get("/", (req: Request, res: Response) => {
      res.send("Home page");
    });

    // Route trang giới thiệu
    router.get("/about", (req: Request, res: Response) => {
      res.send("About this tutorial");
    });

    // Xử lý lỗi và ngoại lệ cho route "/about" với database
    router.get("/about-data", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const aboutRepository = AppDataSource.getRepository(Author); // Ví dụ dùng Author entity
        const about = await aboutRepository.find();
        res.send(about);
      } catch (err) {
        next(err);
      }
    });

    app.use('/api', router);

    // Khởi động server
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });

  })
  .catch(error => console.log("Database connection error:", error));

export default app;
