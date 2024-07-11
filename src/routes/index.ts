import { Router } from 'express';
import bookRoutes from './Book.routes';
import authorRoutes from './Author.routes';
import bookInstanceRoutes from './BookInstance.routes';
import genreRoutes from './Genre.routes';

const router = Router();

router.use("/authors", authorRoutes);
router.use("/books", bookRoutes);
router.use("/book-instances", bookInstanceRoutes);
router.use("/genres", genreRoutes);

export default router;
