import {Router} from 'express';
import { authorList, authorDetail, authorCreate, authorDeleteGet, authorDeletePost, authorUpdate } from '../controllers/Author.controller';

const router = Router();

router.get('/', authorList);

router.get('/:id', authorDetail);

router.post('/create', authorCreate);

router.post('/delete/deletePost', authorDeletePost);

router.post('/delete/:id', authorDeleteGet);

router.post('/update/:id', authorUpdate);

export default router;
