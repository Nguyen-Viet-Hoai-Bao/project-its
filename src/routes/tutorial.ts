
import express, { Request, Response, NextFunction } from "express";
import { AppDataSource } from '../config/data-source';
import { Author } from "../entity/Author.entity";

const router = express.Router();

AppDataSource.initialize().then(() => {
    console.log("Database connected");

    router.get("/", (req: Request, res: Response) => {
        res.send("Home page");
    });

    router.get("/about", (req: Request, res: Response) => {
        res.send("About this tutorial");
    });

    // xu ly loi
    router.get("/about-data", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const aboutRepository = AppDataSource.getRepository(Author);
            console.log(aboutRepository);

            const about = await aboutRepository.find();
            res.send(about);
        } catch (err) {
            next(err);
        }
    });

    // xu ly ngoai le
    router.get("/about-data-catch", (req: Request, res: Response, next: NextFunction) => {
      AppDataSource.getRepository(Author)
      .find()
      .then((about) => res.send(about))
      .catch((err) => next(err))
      })

}).catch(error => console.log("Database connection error:", error));

export default router;
