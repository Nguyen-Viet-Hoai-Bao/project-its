import { Router } from 'express';
import { bookInstanceList, bookInstanceDetail, bookInstanceDelete, bookInstanceUpdate, bookInstanceCreateGet, bookInstanceCreatePost } from '../controllers/BookInstance.controller';

const router = Router();

router.get('/', bookInstanceList);

router.get('/create', bookInstanceCreateGet);

router.get('/:id', bookInstanceDetail);

router.post('/createPost', bookInstanceCreatePost);

router.post('/delete/:id', bookInstanceDelete);

router.post('/update/:id', bookInstanceUpdate);

export default router;