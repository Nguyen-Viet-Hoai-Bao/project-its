import {Router} from 'express';
import { bookInstanceList, bookInstanceDetail, bookInstanceCreate, bookInstanceDelete, bookInstanceUpdate } from '../controllers/BookInstance.controller';

const router = Router();

router.get('/', bookInstanceList);

router.get('/:id', bookInstanceDetail);

router.post('/create', bookInstanceCreate);

router.post('/delete/:id', bookInstanceDelete);

router.post('/update/:id', bookInstanceUpdate);

export default router;
