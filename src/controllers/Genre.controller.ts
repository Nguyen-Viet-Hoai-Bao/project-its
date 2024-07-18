import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { findAllGenres, findGenreById, createGenre, updateGenre, deleteGenre } from '../services/Genre.service';
import { body, Result, validationResult } from 'express-validator';
import { Genre } from '@src/entity/Genre.entity';
import { AppDataSource } from '@src/config/data-source';

export const genreList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genres = await findAllGenres();
        res.render('genres/index', { genres, title: 'List of Genres' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch genres', error });
    }
});

export const genreDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genreId = parseInt(req.params.id, 10);
        const genre = await findGenreById(genreId);
        res.render('genres/detail', { genre, title: 'Genre Detail' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch genre details', error });
    }
});

export const genreCreate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const newGenre = await createGenre({ name });
        res.status(201).json(newGenre);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create genre', error });
    }
});

export const genreUpdate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genreId = parseInt(req.params.id, 10);
        const { name } = req.body;
        const updatedGenre = await updateGenre(genreId, { name });

        if (updatedGenre) {
            res.json(updatedGenre);
        } else {
            res.status(404).json({ message: 'Genre not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update genre', error });
    }
});

export const genreDelete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genreId = parseInt(req.params.id, 10);
        const isDeleted = await deleteGenre(genreId);

        if (isDeleted) {
            res.json({ message: 'Genre deleted' });
        } else {
            res.status(404).json({ message: 'Genre not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete genre', error });
    }
});

export const genreCreateGet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.render('genres/form', { title: 'Create new genre' })
})

const genreRepository = AppDataSource.getRepository(Genre);
export const genreCreatePost = [
    body('name', 'Genre name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        const genre = new Genre();
        if (!errors.isEmpty()) {
            res.render('genres/form', {
                title: 'Create Genre',
                genre: genre,
                errors: errors.array()
            });
            return;
        } else {
            const genreExists = await genreRepository.findOne({ where: { name: req.body.name }});
            if (genreExists) {
                res.render('genres/form', {
                    title: 'Create Genre',
                    genre: genre,
                    errors: [{ msg: 'Genre name already exists' }] 
                });
            } else {
                const { name } = req.body;
                const newGenre = await createGenre({ name });
                const genres = await findAllGenres();
                res.render('genres/index', { genres, title: 'List of Genres' });
            }
        }
    })
];