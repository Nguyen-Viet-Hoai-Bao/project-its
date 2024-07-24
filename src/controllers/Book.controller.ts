import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthorService, getAuthors } from '@src/services/Author.service';
import { BookService, getBooks, getBookById, updateBook, createBook } from '@src/services/Book.service';
import { BookInstanceService } from '@src/services/BookInstance.service';
import { GenreService, getGenres } from '@src/services/Genre.service';
import { BookInstanceStatus } from '@src/enums/BookInstanceStatus';
import { body, validationResult } from 'express-validator';

const authorService = new AuthorService();
const bookService = new BookService();
const bookInstanceService = new BookInstanceService();
const genreService = new GenreService();

async function validateAndFetchBook(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        req.flash('error_msg', req.t('notlist.invalidBookId'));
        return res.redirect('/error');
    }
    const book = await getBookById(id);
    if (book === null) {
        req.flash('error_msg', req.t('notlist.bookNotFound'));
        return res.redirect('/error');
    }
    return book;
}

export const index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const [numBooks, numBookInstances, availableBookInstances, numAuthors, numGenres] = await Promise.all([
        bookService.getIndexDataBook(),
        bookInstanceService.getIndexDataBookInstances(),
        bookInstanceService.getIndexDataAvailableBookInstances(),
        authorService.getIndexDataAuthor(),
        genreService.getIndexDataGenre()
    ]);
    res.render('index', {
        title: 'Local Library',
        numBooks,
        numBookInstances,
        numAvailableBookInstances: availableBookInstances,
        numAuthors,
        numGenres
    });
});

export const bookList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await getBooks();
        res.render('books/index', { books, title: req.t('list.book') });
    } catch (error) {
        req.flash('error_msg', req.t('notlist.failedToFetchBooks'));
        res.redirect('/error');
    }
});

export const bookDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const book = await validateAndFetchBook(req, res, next);
    if (book) {
        res.render('books/detail', {
            title: req.t('detail.bookDetail'),
            book,
            bookInstances: book?.bookInstances,
            bookGenres: book?.genres,
            BookInstanceStatus
        });
    }
});

export const bookUpdateGet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
      const errors = validationResult(req);
      const id = parseInt(req.params.id, 10);
      const [book, allAuthors, allGenres] = await Promise.all([
          getBookById(id),
          getAuthors(),
          getGenres()
      ]);

      if (!book) {
          req.flash('error_msg', req.t('notlist.failedToFetchBooks'));
          return res.redirect('/books');
      }

      res.render('books/update', { title: req.t('book.update_book_title'), authors: allAuthors, genres: allGenres, book, errors });
  } catch (error) {
      req.flash('error_msg', req.t('notlist.failedToFetchBooks'));
      return res.redirect('/books');
  }
});

export const bookUpdatePost = [
  (req: Request, res: Response, next: NextFunction) => {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
          return res.status(400).send(req.t('error.invalidBookId'));
      }
      req.body.id = id;

      if (!Array.isArray(req.body.genre)) {
          req.body.genre = typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
      }

      next();
  },
  body('title').trim().isLength({ min: 1 }).escape().withMessage('title_empty'),
  body('author').trim().isLength({ min: 1 }).escape().withMessage('author_empty'),
  body('summary').trim().isLength({ min: 1 }).escape().withMessage('summary_empty'),
  body('isbn').trim().isLength({ min: 1 }).escape().withMessage('isbn_empty'),
  body('genre.*').escape(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const id = req.body.id;
      const errors = validationResult(req);

      const bookData = {
          title: req.body.title,
          author: req.body.author,
          summary: req.body.summary,
          isbn: req.body.isbn
      };
      const genreIds = req.body.genre.map((item: string) => parseInt(item, 10));

      if (!errors.isEmpty()) {
          const [allAuthors, allGenres] = await Promise.all([
              getAuthors(),
              getGenres()
          ]);

          res.render('books/update', {
              title: req.t('book.update_book_title'),
              authors: allAuthors,
              genres: allGenres,
              book: { id, ...bookData, genres: genreIds },
              errors: errors.array()
          });
          return;
      }

      try {
          const updatedBook = await updateBook(id, bookData, genreIds);
          if (updatedBook) {
              req.flash('success_msg', req.t('book.book_updated'));
              return res.render('books/detail', {
                  title: req.t('detail.bookDetail'),
                  book: updatedBook,
                  bookInstances: updatedBook.bookInstances,
                  bookGenres: updatedBook.genres,
                  BookInstanceStatus
              });
          } else {
              res.status(404).send(req.t('error.bookNotFound'));
          }
      } catch (error) {
          req.flash('error_msg', req.t('error.updateFail'));
          return res.redirect('/books');
      }
  })
];

export const bookCreateGet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [authors, genres] = await Promise.all([
      getAuthors(),
      getGenres()
    ]);
    res.render('books/form', { title: req.t('book.create_book'), authors, genres });
  } catch (error) {
    req.flash('error_msg', req.t('notlist.failedToFetchData'));
    res.redirect('/error');
  }
});

export const bookCreatePost = [
    body('title').trim().isLength({ min: 1 }).escape().withMessage('title_empty'),
    body('author').trim().isLength({ min: 1 }).escape().withMessage('author_empty'),
    body('summary').trim().isLength({ min: 1 }).escape().withMessage('summary_empty'),
    body('isbn').trim().isLength({ min: 1 }).escape().withMessage('isbn_empty'),
    body('genre.*').escape(),
  
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        const { title, author, summary, isbn, genre } = req.body;
        const genreIds = Array.isArray(genre) ? genre.map(id => parseInt(id, 10)) : [];
        if (!errors.isEmpty()) {
            const [authors, genres] = await Promise.all([
                getAuthors(),
                getGenres()
            ]);
            res.render('books/form', {
                title: req.t('book.create_book'),
                authors,
                genres,
                book: req.body,
                errors: errors.array()
            });
        } else {
            try {
                await createBook({ title, author, summary, isbn, genres: genreIds });
                req.flash('success_msg', req.t('book.success.bookCreated'));
                res.redirect('/books');
            } catch (err) {
                req.flash('error_msg', req.t('error.createFail'));
                res.redirect('/books/form');
            }
        }
    })
  ];
  

export const bookDelete = (req: Request, res: Response): void => {
  const bookId = req.params.id;
  res.send(`NOT IMPLEMENTED: Book delete: ${bookId}`);
};