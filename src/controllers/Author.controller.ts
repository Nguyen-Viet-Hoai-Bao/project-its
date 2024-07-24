import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { createAuthor, deleteAuthor, getAuthorById, getAuthors } from '../services/Author.service';
import { body, validationResult } from "express-validator";

async function validateAndFetchAuthor(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        req.flash('error_msg', req.t('notlist.invalidAuthorId'));
        return res.redirect('/error');
    }
    const author = await getAuthorById(id);
    if (author === null) {
        req.flash('error_msg', req.t('notlist.authorNotFound'));
        return res.redirect('/error');
    }
    return author;
}

export const authorList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authors = await getAuthors();
        res.render('authors/index', { authors, title: req.t('list.author') });
    } catch (error) {
        req.flash('error_msg', req.t('notlist.failedToFetchAuthors'));
        res.redirect('/error'); 
    }
});

export const authorDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const author = await validateAndFetchAuthor(req, res, next);
    if (author) {
        res.render('authors/detail', {
            title: req.t('detail.authorDetail'),
            author,
            author_books: author?.books,
        });
    }
});

export const authorCreateGet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.render('authors/form', { title: req.t('create.author') })
})

export const authorCreatePost = [
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('empty_first_name'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('empty_family_name'),
    body('date_of_birth').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('invalid_date_of_birth'),
    body('date_of_death').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('invalid_date_of_death'),
    
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => req.t(`error_messages.${error.msg}`)).join(' ');
        req.flash('error_msg', errorMessages);
        return res.redirect('/authors/create');
      } else {
        const { first_name, family_name, date_of_birth, date_of_death } = req.body;
        try {
          await createAuthor({ first_name, family_name, date_of_birth, date_of_death });
          req.flash('success_msg', req.t('notlist.authorCreateSuccess'));
          return res.redirect('/authors');
        } catch (err) {
          req.flash('error_msg', req.t('error_messages.author_create_error'));
          return res.redirect('/authors/create');
        }
      }
    })
  ];
  

  export const authorDeleteGet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            req.flash('error_msg', req.t('error.invalidAuthorId'));
            return res.redirect('/authors');
        }

        const author = await getAuthorById(id);
        if (!author) {
            req.flash('error_msg', req.t('error.failedToFetchAuthors'));
            return res.redirect('/authors');
        }

        const authorBooks = author?.books;
        res.render('authors/delete', { title: req.t('delete_author_title'), author, authorBooks });
    } catch (error) {
        req.flash('error_msg', req.t('error.failedToFetchAuthors'));
        return res.redirect('/authors');
    }
});


export const authorDeletePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.body.authorid, 10);
        if (isNaN(id)) {
            req.flash('error_msg', req.t('error.invalidAuthorId'));
            return res.redirect('/authors');
        }

        const author = await getAuthorById(id);
        if (!author) {
            req.flash('error_msg', req.t('error.failedToFetchAuthors'));
            return res.redirect('/authors');
        }

        const authorBooks = author?.books;
        if (authorBooks.length > 0) {
            res.render('authors/delete', { title: req.t('delete_author_title'), author, authorBooks });
            return;
        } else {
            await deleteAuthor(id);
            req.flash('success_msg', req.t('notlist.authorCreateSuccess'));
            return res.redirect('/authors');
        }
    } catch (error) {
        console.error('Error deleting author:', error.message);
        req.flash('error_msg', req.t('error.deleteFail'));
        return res.redirect('/authors');
    }
});

export const authorUpdate = (req: Request, res: Response): void => {
    const authorId = req.params.id;
    res.send(`NOT IMPLEMENTED: Author update: ${authorId}`);
};