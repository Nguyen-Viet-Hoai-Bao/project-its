import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { createBookInstance, getBookInstanceById, getBookInstances } from '../services/BookInstance.service';
import { BookInstanceStatus } from '@src/enums/BookInstanceStatus';
import { getBooks } from '@src/services/Book.service';
import { body, validationResult } from 'express-validator';

async function validateAndFetchBookInstance(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        req.flash('error_msg', req.t('notlist.invalidBookInstanceId'));
        return res.redirect('/error');
    }
    const bookInstance = await getBookInstanceById(id);
    if (bookInstance === null) {
        req.flash('error_msg', req.t('notlist.bookInstanceNotFound'));
        return res.redirect('/error');
    }
    return bookInstance;
}

export const bookInstanceList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instances = await getBookInstances();
        res.render('book-instances/index', { instances, title: req.t('list.bookinstance') });
    } catch (error) {
        req.flash('error_msg', req.t('notlist.failedToFetchBookInstances'));
        res.redirect('/error');
    }
});

export const bookInstanceDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bookInstance = await validateAndFetchBookInstance(req, res, next);
    if (bookInstance) {
        res.render('book-instances/detail', {
            title: req.t('detail.bookinstanceDetail'),
            bookinstance: bookInstance,
            BookInstanceStatus,
        });
    }
});

export const bookInstanceCreateGet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
      const books = await getBooks();
      res.render('book-instances/form', {
          title: req.t('bookinstance.create_bookinstance'),
          books,
          statuses: Object.values(BookInstanceStatus),
      });
  } catch (error) {
      req.flash('error_msg', req.t('error.failedToFetchBooks'));
      res.redirect('/error');
  }
});


export const bookInstanceCreatePost = [
  body('book').trim().isLength({ min: 1 }).escape().withMessage('book_not_specified'),
  body('imprint').trim().isLength({ min: 1 }).escape().withMessage('imprint_empty'),
  body('due_back').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('invalid_date'),
  body('status').trim().isIn(Object.values(BookInstanceStatus)).escape().withMessage('status_not_specified'),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          const books = await getBooks();
          res.render('book-instances/form', {
              title: req.t('bookinstance.create_bookinstance'),
              books,
              statuses: Object.values(BookInstanceStatus),
              bookInstance: req.body,
              errors: errors.array(),
          });
      } else {
          const { book, imprint, due_back, status } = req.body;
          try {
              await createBookInstance({ book, imprint, due_back, status });
              req.flash('success_msg', req.t('bookinstance.success.bookInstanceCreated'));
              res.redirect('/bookinstances');
          } catch (err) {
              console.error('Error creating book instance:', err.message);
              req.flash('error_msg', req.t('error.createFail'));
              res.redirect('/error');
          }
      }
  }),
];

export const bookInstanceDelete = (req: Request, res: Response): void => {
  const bookInstanceId = req.params.id;
  res.send(`NOT IMPLEMENTED: BookInstance delete: ${bookInstanceId}`);
};

export const bookInstanceUpdate = (req: Request, res: Response): void => {
  const bookInstanceId = req.params.id;
  res.send(`NOT IMPLEMENTED: BookInstance update: ${bookInstanceId}`);
};