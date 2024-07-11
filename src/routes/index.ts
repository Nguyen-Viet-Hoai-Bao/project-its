import { Router } from 'express';
import { index } from '../controllers/Book.controller';
import bookRouter from './Book.routes';

const router = Router();

router.get('/', index);
router.use("/books", bookRouter);

export default router;



