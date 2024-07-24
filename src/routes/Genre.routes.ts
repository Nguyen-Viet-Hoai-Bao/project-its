import { Router } from 'express';
import { genreList, genreDetail, genreCreateGet, genreCreatePost, genreDelete, genreUpdate } from '../controllers/Genre.controller';

const router = Router();

router.get('/', genreList);

router.get('/create', genreCreateGet);

router.get('/:id', genreDetail);

router.post('/createPost', genreCreatePost);

router.post('/delete/:id', genreDelete);

router.post('/update/:id', genreUpdate);

export default router;