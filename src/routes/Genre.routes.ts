import {Router} from 'express';
import { genreList, genreDetail, genreCreate, genreDelete, genreUpdate } from '../controllers/Genre.controller';

const router = Router();

router.get('/', genreList);

router.get('/:id', genreDetail);

router.post('/create', genreCreate);

router.post('/delete/:id', genreDelete);

router.post('/update/:id', genreUpdate);

export default router;
