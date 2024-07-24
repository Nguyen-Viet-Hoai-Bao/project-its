import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { createGenre, getGenreById, getGenreByName, getGenres } from '../services/Genre.service';
import { body, validationResult } from 'express-validator';
import { Genre } from '@src/entity/Genre.entity';

async function validateAndFetchGenre(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        req.flash('error_msg', req.t('notlist.invalidGenreId'));
        return res.redirect('/error');
    }
    const genre = await getGenreById(id);
    if (genre === null) {
        req.flash('error_msg', req.t('notlist.genreNotFound'));
        return res.redirect('/error');
    }
    return genre;
}

export const genreList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genres = await getGenres();
        res.render('genres/index', { genres, title: req.t('list.genre') });
    } catch (error) {
        req.flash('error_msg', req.t('notlist.failedToFetchGenres'));
        res.redirect('/error');
    }
});

export const genreDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const genre = await validateAndFetchGenre(req, res, next);
    if (genre) {
        res.render('genres/detail', {
            title: req.t('detail.genreDetail'),
            genre: genre,
            genre_books: genre?.books,
        });
    }
});

export const genreCreateGet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.render('genres/form', { title: req.t('create.genre') })
})

export const genreCreatePost = [
  body('name').trim().isLength({ min: 3 }).escape(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      const genre = new Genre();
      if (!errors.isEmpty()) {
          const errorMessages = errors.array().map(error => req.t('error.genreNameMinLength'));
          req.flash('error_msg', errorMessages.join(' '));
          return res.redirect('/genres/form');
      } else {
          const genreExists = await getGenreByName(req.body.name);
          if (genreExists) {
              req.flash('error_msg', req.t('error.genreExists'));
              return res.redirect('/genres/form');
          } else {
              const { name } = req.body;
              const newGenre = await createGenre({ name });
              req.flash('success_msg', req.t('success.genreCreated'));
              return res.redirect('/genres');
          }
      }
  })
];

export const genreDelete = (req: Request, res: Response): void => {
  const genreId = req.params.id;
  res.send(`NOT IMPLEMENTED: Genre delete: ${genreId}`);
};

export const genreUpdate = (req: Request, res: Response): void => {
  const genreId = req.params.id;
  res.send(`NOT IMPLEMENTED: Genre update: ${genreId}`);
};