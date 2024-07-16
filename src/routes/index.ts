import { Router } from 'express';
import bookRoutes from './Book.routes';
import authorRoutes from './Author.routes';
import bookInstanceRoutes from './BookInstance.routes';
import genreRoutes from './Genre.routes';
import { index } from '@src/controllers/Book.controller';

const router = Router();

router.use("/authors", authorRoutes);
router.use("/books", bookRoutes);
router.get('/index', index);
router.use("/book-instances", bookInstanceRoutes);
router.use("/genres", genreRoutes);

export default router;
