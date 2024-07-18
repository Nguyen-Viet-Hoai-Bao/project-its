import { Request, Response, NextFunction } from "express";
import asyncHandler from 'express-async-handler';
import i18next from "i18next";
import { AppDataSource } from '../config/data-source';
import { Author } from '../entity/Author.entity';
import { Genre } from '../entity/Genre.entity';
import { BookInstance } from '../entity/BookInstance.entity';
import { Book } from "@src/entity/Book.entity";
import * as bookService from '../services/Book.service';
import { body, validationResult } from "express-validator";
import { findAllAuthors } from "@src/services/Author.service";
import { findAllGenres } from "@src/services/Genre.service";

export const bookList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const books = await bookService.findAllBooks();
    res.render('books/index', { books, title: 'List of Books' });
});

export const bookDetail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bookId = parseInt(req.params.id, 10);
    const book = await bookService.findBookById(bookId);

    if (book) {
        res.render('books/detail', { book, title: 'Detail of Books' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

export const bookCreate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { title, summary, isbn, authorId, genreIds } = req.body;

    try {
        const newBook = await bookService.createBook({ title, summary, isbn }, authorId, genreIds);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create book', error });
    }
});

export const bookDelete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bookId = parseInt(req.params.id, 10);
    const isDeleted = await bookService.deleteBook(bookId);

    if (isDeleted) {
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

export const bookUpdateGet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try{
        const errors = validationResult(req);
        const id = parseInt(req.params.id);
        const [book, allAuthors, allGenres] = await Promise.all([
            bookService.findBookById(id),
            findAllAuthors(),
            findAllGenres()
        ]);
        res.render('books/update', { title: 'Update Book', authors: allAuthors, genres: allGenres, book, errors });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch author details', error });
    }
});

export const bookUpdatePost = [
    (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).send('Invalid book ID');
        }
        req.body.id = id; 
        if (!Array.isArray(req.body.genre)) {
            req.body.genre = typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
        }
        next();
    },
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
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
        const genreIds = req.body.genre.map((item: string) => parseInt(item));

        if (!errors.isEmpty()) {
            const [allAuthors, allGenres] = await Promise.all([
                findAllAuthors(),
                findAllGenres()
            ]);
            res.render('books/update', {
                title: 'Update Book',
                authors: allAuthors,
                genres: allGenres,
                book: { id, ...bookData, genres: genreIds },
                errors: errors.array()
            });
            return;
        }

        const updatedBook = await bookService.updateBook(id, bookData, genreIds);
        if (updatedBook) {
            res.render('books/detail', { book: updatedBook, title: 'Detail of Books' });
        } else {
            res.status(404).send('Book not found');
        }
    })
];


export const index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bookRepository = AppDataSource.getRepository(Book);
    const authorRepository = AppDataSource.getRepository(Author);
    const genreRepository = AppDataSource.getRepository(Genre);
    const bookInstanceRepository = AppDataSource.getRepository(BookInstance);
    
    const [numBooks, numBookInstances, availableBookInstances, numAuthors, numGenres] = await Promise.all([
        bookRepository.count(),
        bookInstanceRepository.count(),
        bookInstanceRepository.findAndCount({
            where: { status: 'Available' }
        }),
        authorRepository.count(),
        genreRepository.count()
    ]);

    res.render('index', {
        book_count: numBooks,
        book_instance_count: numBookInstances,
        book_instance_available_count: availableBookInstances[1],
        author_count: numAuthors,
        genre_count: numGenres,
        t: i18next.t.bind(i18next)
    });
});
