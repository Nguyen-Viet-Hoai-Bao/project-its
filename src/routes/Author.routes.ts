import {Router} from 'express';
import { authorList, authorDetail, authorCreateGet, authorCreatePost, authorDeletePost, authorDeleteGet, authorUpdate } from '../controllers/Author.controller';

const router = Router();

router.get('/', authorList);

router.get('/create', authorCreateGet);

router.get('/:id', authorDetail);

router.post('/createPost', authorCreatePost);

router.post('/delete/deletePost', authorDeletePost);

router.post('/delete/:id', authorDeleteGet);

router.post('/update/:id', authorUpdate);

export default router;