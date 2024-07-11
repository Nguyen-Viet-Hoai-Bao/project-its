import {Router} from 'express';
import { authorList, authorDetail, authorCreate, authorDelete, authorUpdate } from '../controllers/Author.controller';

const router = Router();

// GET request for list of all Author items.
router.get('/authors', authorList);

// GET request for one Author.
router.get('/author/:id', authorDetail);

// POST request for creating Author.
router.post('/author/create', authorCreate);

// POST request to delete Author.
router.post('/author/delete/:id', authorDelete);

// POST request to update Author.
router.post('/author/update/:id', authorUpdate);

export default router;
