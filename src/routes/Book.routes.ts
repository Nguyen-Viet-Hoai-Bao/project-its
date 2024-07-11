import {Router} from 'express';
import { bookList, bookDetail, bookCreate, bookDelete, bookUpdate } from '../controllers/Book.controller';

const router = Router();

router.get('/', bookList);

router.get('/:id', bookDetail);

router.post('/create', bookCreate);

router.post('/delete/:id', bookDelete);

router.post('/update/:id', bookUpdate);

export default router;
