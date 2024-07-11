import { AppDataSource } from '@src/config/data-source';
import asyncHandler from 'express-async-handler';
import { Genre } from '@src/entity/Genre.entity';
import { Request, Response, NextFunction } from 'express';

const genreRepository = AppDataSource.getRepository(Genre);

// Display list of all BookInstances.
export const genreList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genres = await genreRepository.find();
        res.render('genres/index', { genres, title: 'List of Genre' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch genres', error });
    }
});
// Display detail page for a specific BookInstance.
export const genreDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Get Genre Detail");
        const genreId = parseInt(req.params.id, 10);
        const genre = await genreRepository.findOne({ where: { id: genreId } });
    
        res.render('genres/detail', { genre, title: 'List of Genre' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch genre details', error });
    }
});

export const genreCreate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, url } = req.body;
        const genre = new Genre();
        genre.name = name;
        genre.url = url;

        const savedGenre = await genreRepository.save(genre);
        res.status(201).json(savedGenre);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create genre', error });
    }
});

export const genreUpdate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const genreId = parseInt(req.params.id, 10);
    const genre = await genreRepository.findOne({ where: { id: genreId } });

    if (genre) {
        const { name, url } = req.body;
        genre.name = name;
        genre.url = url;

        const updatedAuthor = await genreRepository.save(genre);
        res.json(updatedAuthor);
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});

export const genreDelete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        console.log("Delete Genre");
        const genreId = parseInt(req.params.id, 10);
        const genre = await genreRepository.findOne({ where: { id: genreId } });

        if (genre) {
            await genreRepository.remove(genre);
            res.json({ message: 'Author deleted' });
        } else {
            res.status(404).json({ message: 'Author not found' });
        }
});
