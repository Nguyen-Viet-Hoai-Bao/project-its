import {Router} from 'express';
import { bookList } from '../controllers/Book.controller';

const bookRouter = Router();

bookRouter.get('/', bookList);

export default bookRouter;