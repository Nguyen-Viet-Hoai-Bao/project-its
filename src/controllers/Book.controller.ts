import { Request, Response, NextFunction } from "express";
import asyncHandler from 'express-async-handler';
import { AppDataSource } from '../config/data-source';
import { Book } from '../entity/Book.entity';
import { Author } from "@src/entity/Author.entity";
import { Genre } from "@src/entity/Genre.entity";

const bookRepository = AppDataSource.getRepository(Book);

// Display list of all Books.
export const bookList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const books = await bookRepository.find({ relations: ['author', 'genres'] });
  
    res.render('books/index', { books, title: 'List of Books' });
});

// Display detail page for a specific Book.
export const bookDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Get Book Detail");
    const bookId = parseInt(req.params.id, 10);
    const book = await bookRepository.findOne({ where: { id: bookId } });

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

export const bookCreate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Create Book");
    const { title, summary, isbn, url, authorId, genreIds } = req.body;

    try {
        const author = authorId ? await AppDataSource.getRepository(Author).findOne(authorId) : null;
        const genres = genreIds ? await AppDataSource.getRepository(Genre).findByIds(genreIds) : [];

        const newBook = bookRepository.create({title, summary, isbn, url,
            author: author || undefined, 
            genres: genres.length > 0 ? genres : undefined, 
         });

        await bookRepository.save(newBook);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create book', error });
    }
});

// Handle Book delete on DELETE.
export const bookDelete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Delete Book");
    const bookId = parseInt(req.params.id, 10);
    const book = await bookRepository.findOne({ where: { id: bookId } });

    if (book) {
        await bookRepository.remove(book);
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

// Handle Book update on PUT.
export const bookUpdate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Update Book");
    const bookId = parseInt(req.params.id, 10);
    const { title, summary, isbn, url, authorId, genreIds } = req.body;
    const book = await bookRepository.findOne({ where: { id: bookId } });

    if (book) {
        try {
            const genres = await AppDataSource.getRepository(Genre).findByIds(genreIds);

            book.title = title;
            book.summary = summary;
            book.isbn = isbn;
            book.url = url;
            book.author = authorId ;
            book.genres = genres;

            const updatedBook = await bookRepository.save(book);
            res.json(updatedBook);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update book', error });
        }
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});
