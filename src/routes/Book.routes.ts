import {Router} from 'express';
import { bookList, bookDetail, bookCreate, bookDelete, bookUpdateGet, bookUpdatePost } from '../controllers/Book.controller';

const router = Router();

router.get('/', bookList);

router.get('/:id', bookDetail);

router.get('/update/:id', bookUpdateGet);

router.post('/create', bookCreate);

router.post('/delete/:id', bookDelete);

router.post('/update/updatePost/:id', bookUpdatePost);

export default router;
