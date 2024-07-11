import {Router} from 'express';
import { authorList, authorDetail, authorCreate, authorDelete, authorUpdate } from '../controllers/Author.controller';

const router = Router();

router.get('/', authorList);

router.get('/:id', authorDetail);

router.post('/create', authorCreate);

router.post('/delete/:id', authorDelete);

router.post('/update/:id', authorUpdate);

export default router;
