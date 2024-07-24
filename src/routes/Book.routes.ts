import { Router } from 'express';
import { bookList, bookDetail, bookUpdateGet, bookUpdatePost, bookCreateGet, bookCreatePost } from '../controllers/Book.controller';

const router = Router();

router.get('/', bookList);

router.get('/create', bookCreateGet);

router.get('/:id', bookDetail);

router.post('/createPost', bookCreatePost);

router.get('/update/:id', bookUpdateGet);

router.post('/update/updatePost/:id', bookUpdatePost);

export default router;